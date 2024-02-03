<template>
  <div data-theme="lofi" class="min-h-screen w-full">
    <div class="p-8 space-y-4">
      <h1>Speckle Connector Autodesk Platform Services</h1>
      <h2>Hubs</h2>
      <select
        v-model="selectedHub"
        class="select select-primary w-full max-w-xs"
        placeholder="Select a hub"
      >
        <option v-for="hub in hubs" :value="hub.id">
          {{ hub.name }}
        </option>
      </select>

      <h2>Projects</h2>
      <input
        type="text"
        placeholder="Type here"
        v-model="projectSearch"
        class="input input-primary w-full max-w-xs"
      />
      <div class="flex w-full">
        <div class="grid grid-cols-3 gap-6 mx-auto place-items-center">
          <div
            v-for="project in firstTenProjects"
            class="card w-96 bg-primary text-primary-content"
          >
            <div class="card-body h-48">
              <h2 class="card-title">{{ project.name }}</h2>
              <div class="card-actions justify-end">
                <button class="btn" @click="openModelsModal(project)">
                  Select
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ModelsModal
      v-if="selectedProject"
      :project="selectedProject"
      v-model:open="isModelsModalOpen"
    />
  </div>
</template>

<script setup lang="ts">
import type { Project } from './server/api/projects';

const { data: hubs, pending } = await useFetch('/api/hubs');

const selectedHub = ref('');
const projectSearch = ref('');
const selectedProject = ref<Project | null>(null);
const isModelsModalOpen = ref(false);

const openModelsModal = (project: Project) => {
  selectedProject.value = project;
  isModelsModalOpen.value = true;
};

const firstTenProjects = computed(() => projects.value?.slice(0, 10) || []);

const {
  data: projects,
  refresh,
  execute,
} = await useFetch('/api/projects', {
  query: { hubId: selectedHub, projectSearch },
});
</script>
