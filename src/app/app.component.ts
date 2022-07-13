import {Component} from '@angular/core';
import {Background, Feature, Given, Rule, Scenario, Then, When} from "./models/bdd";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ac_builder';
  feature = this.showBackgroundExample();

  showRuleWithBackgroundExample(): Feature {
    const feature = new Feature("Overdue tasks", "Let users know when tasks are overdue, even when using other features of the app");
    const rule = new Rule("Users are notified about overdue tasks on first use of the day", null);
    let background = new Background();
    let scenario1 = new Scenario("First use of the day");
    let scenario2 = new Scenario("Already used today");

    feature.addRule(rule);
    rule.addBackground(background);
    background.addGiven(new Given("Given I have overdue tasks"));
    //
    scenario1.addStep(new Given("I last used the app yesterday"));
    scenario1.addStep(new When("I use the app"));
    scenario1.addStep(new Then("I am notified about overdue tasks"));
    //
    scenario2.addStep(new Given("Already used today"));
    scenario2.addStep(new When("I use the app"));
    scenario2.addStep(new Then("I am not notified about overdue tasks"));
    //
    rule.addScenario(scenario1);
    rule.addScenario(scenario2);
    console.log(feature.print());
    return feature;
  }

  showBackgroundExample() {
    const feature = new Feature("Multiple site support", "Only blog owners can post to a blog, except administrators, who can post to all blogs.");
    let background = new Background();
    let scenario1 = new Scenario("Dr. Bill posts to his own blog");
    let scenario2 = new Scenario("Dr. Bill tries to post to somebody else's blog, and fails");
    let scenario3 = new Scenario("Greg posts to a client's blog");

    feature.addBackground(background);
    background.addGiven(new Given("a global administrator named \"Greg\""));
    background.addGiven(new Given("a blog named \"Greg's anti-tax rants\""));
    background.addGiven(new Given("a customer named \"Dr. Bill\""));
    background.addGiven(new Given("a blog named \"Expensive Therapy\" owned by \"Dr. Bill\""));
    feature.addScenario(scenario1);
    feature.addScenario(scenario2);
    feature.addScenario(scenario3);

    scenario1.addStep(new Given("I am logged in as Dr. Bill"));
    scenario1.addStep(new When("I try to post to \"Expensive Therapy\""));
    scenario1.addStep(new Then("I should see \"Your article was published.\""));

    scenario2.addStep(new Given("I am logged in as Dr. Bill"));
    scenario2.addStep(new When("I try to post to \"Greg's anti-tax rants\""));
    scenario2.addStep(new Then("I should see \"Hey! That's not your blog!\""));

    scenario3.addStep(new Given("I am logged in as Greg"));
    scenario3.addStep(new When("I try to post to \"Expensive Therapy\""));
    scenario3.addStep(new Then("I should see \"Your article was published.\""));

    console.log(feature.print());
    return feature;
  }
}
