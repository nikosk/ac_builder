export type KeywordTag = "Feature" | "Rule" | "Example" | "Scenario" | "Background";
export type StepTag = "Given" | "When" | "Then" | "And" | "But";

function tabs(number: number) {
  return " ".repeat(number * 2);
}

interface Printable {
  print(level: number): string;
}

interface WithTitle {
  title: string | null;
}

interface WithDescription {
  description: string | null;
}

export interface Keyword {
  tag: KeywordTag;
}

interface WithBackground {
  background: Background | null;

  addBackground(background: Background): void;
}

abstract class WithBackgroundImpl implements WithBackground {
  abstract background: Background | null;

  addBackground(background: Background): void {
    if (this.background) {
      throw new Error("Background is already set. Please delete and then add");
    }
    this.background = background;
  }

}

export class Feature extends WithBackgroundImpl implements Keyword, WithBackground, WithTitle, WithDescription, Printable {
  tag: KeywordTag = "Feature";
  background: Background | null = null;
  rules: Rule[] = [];
  scenarios: Scenario[] = [];

  constructor(public title: string, public description: string | null) {
    super();
  }

  addRule(rule: Rule) {
    this.rules.push(rule);
  }

  print(): string {
    return `${this.tag}: ${this.title}\n${this.background ? this.background.print(1) : ''}\n${this.rules.map(r => {
      return r.print(1);
    }).join("")}\n${this.scenarios.map(s => {
      return s.print(1)
    }).join("")}`;
  }

  addScenario(scenario: Scenario) {
    this.scenarios.push(scenario);
  }

  hasBackground() {
    return this.background != null;
  }
}

export class Rule extends WithBackgroundImpl implements Keyword, WithTitle, WithDescription, Printable {
  tag: KeywordTag = "Rule";
  background: Background | null = null;
  scenarios: Scenario[] = [];

  constructor(public title: string, public description: string | null) {
    super();
  }

  addScenario(scenario: Scenario) {
    this.scenarios.push(scenario);
  }

  print(level: number): string {
    return `${tabs(level)}${this.tag}: ${this.title}\n${this.background ? this.background.print(level + 1) : ''}\n${this.scenarios.map(s => {
      return s.print(level + 1)
    }).join("")}`;
  }
}

export interface Step extends Printable {
  tag: StepTag;
  definition: string;
}

abstract class StepImpl implements Step, Printable {
  abstract tag: StepTag;

  constructor(public definition: string) {
  }

  print(level: number): string {
    return `${tabs(level)}${this.tag} ${this.definition}\n`;
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

  constructor(public title: string) {
  }

  addStep(step: Step) {
    this.steps.push(step);
  }

  print(level: number): string {
    return `${tabs(level)}${this.tag}: ${this.title}\n${this.steps.map(s => {
      return s.print(level + 1);
    }).join("")}\n`;
  }
}

export class Background implements Keyword, Printable {
  tag: KeywordTag = "Background"
  givens: Step[] = []

  print(level: number): string {
    return `${tabs(level)}${this.tag}:\n${this.givens.map((g) => {
      return g.print(level + 1)
    }).join("")}`;
  }

  addGiven(given: Given) {
    if (this.givens.length == 0) {
      this.givens.push(given);
    } else {
      this.givens.push(new And(given.definition));
    }
  }
}
