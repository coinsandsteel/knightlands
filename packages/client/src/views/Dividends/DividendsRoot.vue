<template>
  <keep-alive :exclude="['Withdrawal', 'DividendsWithdrawals']">
    <router-view></router-view>
  </keep-alive>
</template>
