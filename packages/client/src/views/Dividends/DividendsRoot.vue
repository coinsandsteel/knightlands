<template>
  <keep-alive
    :exclude="['Withdrawal', 'DividendsWithdrawals', 'DepositPresalePacks']"
  >
    <router-view></router-view>
  </keep-alive>
</template>
