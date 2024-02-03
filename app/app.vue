<template>
  <div data-theme="lofi" class="flex flex-col min-h-screen">
    <div class="drawer drawer-end absolute bg-pink-300">
      <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />

      <div class="drawer-content bg-purple-500">
        <div class="p-8 bg-white min-h-screen relative">
          <div class="absolute right-8">
            <label for="my-drawer-4" class="drawer-button btn btn-primary"
              >Open</label
            >
            <!-- <label
              for="my-drawer-4"
              class="drawer-button btn btn-primary"
              @click="handleSend"
              >Send</label
            > -->
          </div>
          <div class="">
            <h1 class="text-4xl mb-8">
              Speckle Connector Autodesk Platform Services
            </h1>
            <div class="stats shadow">
              <div class="stat w-80">
                <div class="stats-title">Hubs</div>
                <div class="stat-value">
                  <select
                    v-model="selectedHub"
                    class="select select-primary w-full max-w-xs"
                    placeholder="Select a hub"
                  >
                    <option v-for="hub in hubs" :value="hub.id">
                      {{ hub.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="stat">
                <div class="stat-title">Projects</div>
                <div class="stat-value">
                  <input
                    type="text"
                    placeholder="Search projects"
                    v-model="projectSearch"
                    class="input input-primary w-full max-w-xs"
                  />
                </div>
              </div>
            </div>
          </div>
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

        <!-- Page content here -->
      </div>
      <div class="drawer-side">
        <label
          for="my-drawer-4"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></label>
        <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <!-- Sidebar content here -->
          <li><a>Sidebar Item 1</a></li>
          <li><a>Sidebar Item 2</a></li>
        </ul>
      </div>
    </div>
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

async function handleSend() {
  await useFetch('/api/job');
}

const {
  data: projects,
  refresh,
  execute,
} = await useFetch('/api/projects', {
  query: { hubId: selectedHub, projectSearch },
});
</script>
