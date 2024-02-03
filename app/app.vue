<template>
  <div>
    <h1 class="text-3xl font-bold underline">
      Speckle Connector Autodesk Platform Services
    </h1>
    <h2>Hubs</h2>
    <select v-model="selectedHub" class="select w-full max-w-xs">
      <option v-for="hub in hubs" :value="hub.id">
        {{ hub.name }}
      </option>
    </select>

    <h2>Projects</h2>
    <div class="grid grid-cols-3">
      <div
        v-for="project in projects"
        class="card w-96 bg-primary text-primary-content"
      >
        <div class="card-body">
          <h2 class="card-title">{{ project.name }}</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div class="card-actions justify-end">
            <button class="btn">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: hubs, pending } = await useFetch('/api/hubs');
const selectedHub = ref('');

const {
  data: projects,
  refresh,
  execute,
} = await useFetch('/api/projects', {
  query: { hubId: selectedHub },
});
</script>
