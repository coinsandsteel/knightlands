<template>
  <div class="flex flex-column flex-items-center font-size-22">
    <!-- DIVIDENDS INFO -->
    <StripedPanel class="width-90">
      <span class="title margin-top-1">Available Dividends</span>
      <StripedContent
        classes="margin-top-5 margin-bottom-5"
        contentClasses="width-100 flex flex-space-evenly"
        stripeHeight="6rem"
      >
        <IconWithValue
          iconClass="icon-trx"
          valueClass="font-size-30 font-weight-900"
          :flip="true"
        >30000</IconWithValue>
      </StripedContent>

      <span class="font-size-20">Estimated dividends for you:</span>

      <StripedContent
        classes="margin-top-2 margin-bottom-5"
        contentClasses="width-100 flex flex-space-evenly"
        stripeHeight="6rem"
      >
        <IconWithValue
          iconClass="icon-trx"
          valueClass="font-size-20 font-weight-900"
          :flip="true"
        >450</IconWithValue>
      </StripedContent>

      <span class="font-size-18">Next payout in 43:44:44</span>
    </StripedPanel>

    <!-- DIVIDENDS MANAGEMENT -->
    <div class="flex flex-center width-100 margin-top-2 flex-space-evenly">
      <Line3Element class="width-25 margin-right-half">
        <template v-slot:title>Available DKT</template>
        <template v-slot:value>0.0</template>
        <template>
          <CustomButton>Withdraw</CustomButton>
        </template>
      </Line3Element>

      <Line3Element class="width-25 margin-right-half">
        <template v-slot:title>DKT Balance</template>
        <template v-slot:value>0.0</template>
        <template>
          <CustomButton type="blue">Freeze</CustomButton>
        </template>
      </Line3Element>

      <Line3Element class="width-25 margin-right-half">
        <template v-slot:title>Frozen DKT</template>
        <template v-slot:value>0.0</template>
        <template>
          <CustomButton type="green">Unfreeze</CustomButton>
        </template>
      </Line3Element>

      <Line3Element class="width-25 margin-top-3">
        <template v-slot:title>Available TRX</template>
        <template v-slot:value>0.0</template>
        <template>
          <CustomButton type="yellow">Withdraw</CustomButton>
        </template>
      </Line3Element>
    </div>
  </div>
</template>

<script>
import StripedPanel from "@/components/StripedPanel.vue";
import StripedContent from "@/components/StripedContent.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import Line3Element from "./Line3Element";
import CustomButton from "@/components/Button.vue";

export default {
  components: {
    StripedPanel,
    StripedContent,
    IconWithValue,
    Line3Element,
    CustomButton
  }
};
</script>