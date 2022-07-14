export type KeywordTag = "Feature" | "Rule" | "Example" | "Scenario" | "Background";
export type StepTag = "Given" | "When" | "Then" | "And" | "But";

function tabs(number: number) {
  return " ".repeat(number * 2);
}

interface Printable {
  print(): string;
}

interface WithTitle {
  title: string | null;
}

interface WithDescription {
  description: string | null;
}

export interface Keyword {
  tag: KeywordTag;

  getLevel(): number;
}

interface WithBackground {
  addBackground(background: Background): void;
}

abstract class WithBackgroundImpl implements WithBackground {

  protected background: Background | null = null;

  addBackground(background: Background): void {
    if (this.background) {
      throw new Error("Background is already set. Please delete and then add");
    }
    this.background = background;
  }

}

export class Feature extends WithBackgroundImpl implements Keyword, WithBackground, WithTitle, WithDescription, Printable {

  tag: KeywordTag = "Feature";
  private rules: Rule[] = [];
  private scenarios: Scenario[] = [];

  constructor(public title: string, public description: string | null) {
    super();
  }

  addRule(rule: Rule) {
    rule.parent = this;
    this.rules.push(rule);
  }

  override addBackground(background: Background) {
    super.addBackground(background);
    background.parent = this;
  }

  print(): string {
    return `${this.tag}: ${this.title}\n${this.description}\n\n${this.background ? this.background.print() : ''}\n${this.rules.map(r => {
      return r.print();
    }).join("")}\n${this.scenarios.map(s => {
      return s.print()
    }).join("")}`;
  }

  addScenario(scenario: Scenario) {
    scenario.parent = this;
    this.scenarios.push(scenario);
  }

  hasBackground() {
    return this.background != null;
  }

  getLevel(): number {
    return 1;
  }
}

export class Rule extends WithBackgroundImpl implements Keyword, WithTitle, WithDescription, Printable {
  tag: KeywordTag = "Rule";
  scenarios: Scenario[] = [];
  public parent!: Feature;

  constructor(public title: string, public description: string | null) {
    super();
  }

  addScenario(scenario: Scenario) {
    scenario.parent = this;
    this.scenarios.push(scenario);
  }

  print(): string {
    return `${tabs(this.getLevel())}${this.tag}: ${this.title}\n${this.background ? this.background.print() : ''}\n${this.scenarios.map(s => {
      return s.print()
    }).join("")}`;
  }

  getLevel(): number {
    return this.parent.getLevel() + 1;
  }

  override addBackground(background: Background) {
    super.addBackground(background);
    background.parent = this;
  }

}

export interface Step extends Printable {

  tag: StepTag;
  definition: string;
}

abstract class StepImpl implements Step, Printable {
  abstract tag: StepTag;
  parent!: Scenario | Background
  constructor(public definition: string) {
  }

  print(): string {
    return `${tabs(this.getLevel())}${this.tag} ${this.definition}\n`;
  }

  getLevel(): number {
    return this.parent.getLevel() + 1;
  }
}

export class Given extends StepImpl {
  tag: StepTag = "Given";

}

export class When extends StepImpl {
  tag: StepTag = "When";
}

export class Then extends StepImpl {
  tag: StepTag = "Then";
}

export class And extends StepImpl {
  tag: StepTag = "And";
}

export class But extends StepImpl {
  tag: StepTag = "But";
}

export class Scenario implements Keyword, WithTitle, Printable {
  tag: KeywordTag = "Scenario";
  steps: Step[] = [];
  parent!: Keyword;

  constructor(public title: string) {
  }

  addStep(step: StepImpl) {
    step.parent = this;
    this.steps.push(step);
  }

  print(): string {
    return `${tabs(this.getLevel())}${this.tag}: ${this.title}\n${this.steps.map(s => {
      return s.print();
    }).join("")}\n`;
  }

  getLevel(): number {
    return this.parent.getLevel() + 1;
  }

}

export class Background implements Keyword, Printable {
  tag: KeywordTag = "Background"
  givens: Step[] = []
  parent!: Rule | Feature

  constructor() {
  }

  print(): string {
    return `${tabs(this.getLevel())}${this.tag}:\n${this.givens.map((g) => {
      return g.print()
    }).join("")}`;
  }

  addGiven(given: Given) {
    given.parent = this;
    if (this.givens.length == 0) {
      this.givens.push(given);
    } else {
      let and = new And(given.definition);
      and.parent = this;
      this.givens.push(and);
    }
  }

  getLevel(): number {
    return this.parent.getLevel() + 1;
  }
}
