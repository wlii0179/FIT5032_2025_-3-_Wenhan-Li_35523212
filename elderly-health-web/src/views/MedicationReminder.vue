<template>
  <div>
    <h2>Medication Reminder</h2>
    <ul>
      <li><router-link to="/medication-reminder/add-reminder">Add Reminder</router-link></li>
      <li><router-link to="/medication-reminder/reminder-history">Reminder History</router-link></li>
    </ul>
    <router-view />
  </div>
</template> 