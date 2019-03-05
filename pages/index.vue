<template>
  <section class="container">
    <h1>A Clean Nuxt Build</h1>
    <h2>TESTING: {{testPurpose}}</h2>
  </section>
</template>

<script>

export default {
  data() {
    return {
      testPurpose: 'Prismic'
    }
  },
  mounted() {
    console.log('!!!mounted on root route')
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

  h1,
  h2 {
    display: block;
    margin-bottom: 0.5rem;
  }
</style>
