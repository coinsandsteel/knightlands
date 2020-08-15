import TrialType from "@/../../knightlands-shared/trial_type";

const backgrounds = {};
backgrounds[TrialType.Armour] = ["trials_of_honor_common.png", "trials_of_honor_rare.png", "trials_of_honor_epic.png", "trials_of_honor_legendary.png"];
backgrounds[TrialType.Weapon] = ["conjured_trials_common.png", "conjured_trials_rare.png", "conjured_trials_epic.png", "conjured_trials_legendary.png", "conjured_trials_mythical.png"];
backgrounds[TrialType.Accessory] = ["trials_of_decay_rare.png", "trials_of_decay_rare.png", "trials_of_decay_epic.png", "trials_of_decay_epic.png"];

export default {
    getBackground(trialType, trialIndex) {
        return `/images/trials/${backgrounds[trialType][trialIndex]}`;
    }
}
