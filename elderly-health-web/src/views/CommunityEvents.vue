<template>
  <div>
    <h2>Community Events</h2>
    <ul>
      <li><router-link to="/community-events/event-calendar">Event Calendar</router-link></li>
      <li><router-link to="/community-events/event-registration">Event Registration</router-link></li>
      <li><router-link to="/community-events/event-gallery">Event Gallery/Review</router-link></li>
    </ul>
    <router-view />
  </div>
</template> 