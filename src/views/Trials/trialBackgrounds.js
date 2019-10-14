import TrialType from "@/../knightlands-shared/trial_type";

const backgrounds = {};
backgrounds[TrialType.Armour] = ["trials_of_honor_common.png", "trials_of_honor_rare.png", "trials_of_honor_epic.png", "trials_of_honor_legendary.png"];

export default {
    getBackground(trialType, trialIndex) {
        return backgrounds[trialType][trialIndex];
    }
}