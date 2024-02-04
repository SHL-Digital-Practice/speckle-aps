<template>
  <div data-theme="lofi">
    <div class="flex flex-col min-h-screen">
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
            <main class="max-w-6xl w-full mx-auto">
              <h1 class="text-4xl mb-8">
                Speckle Connector Autodesk Platform Services
              </h1>
              <div class="flex py-4 gap-8 w-full">
                <div class="card w-96 bg-base-100 shadow-xl">
                  <div class="card-body">
                    <div class="card-title">Hubs</div>
                    <select
                      v-model="selectedHub"
                      class="select select-primary w-full"
                      placeholder="Select a hub"
                    >
                      <option v-for="hub in hubs" :value="hub.id">
                        {{ hub.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="card w-full bg-base-100 shadow-xl">
                  <div class="card-body">
                    <div class="card-title">Projects</div>
                    <input
                      type="text"
                      placeholder="Search projects..."
                      v-model="projectSearch"
                      class="input input-primary w-full"
                    />
                  </div>
                </div>
              </div>
            </main>
            <div class="flex w-full py-8" v-if="!pendingProjects">
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
            <div
              v-else
              class="flex flex-col items-center gap-4 p-24 text-3xl justify-center"
            >
              <span class="loading loading-bars loading-lg"></span>
              <span>Loading</span>
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
          <ul
            class="menu p-4 w-80 min-h-full bg-base-200 relative text-base-content"
          >
            <div class="">
              <h2 class="text-2xl mb-4">Models</h2>
              <!-- Sidebar content here -->
              <li v-for="model in modelsCart" v-if="modelsCart.length > 0">
                <a>{{ (model as any).name }}</a>
              </li>
              <div class="v-else">
                <span class="text-gray-800"
                  >You haven't chosen any models.</span
                >
              </div>
            </div>
            <div class="absolute bottom-0 left-0 w-full p-4">
              <button @click="handleSend" class="btn btn-primary w-full">
                Send
              </button>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from './server/api/projects';

const { data: hubs } = await useFetch('/api/hubs');

const modelsCart = useModelsCart();
console.log(modelsCart.value);

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
  await useFetch('/api/job', {
    query: {
      derivatives: modelsCart.value.map((m) => m.latestVersion as string),
    },
  });
}

const {
  data: projects,
  refresh,
  execute,
  pending: pendingProjects,
} = await useFetch('/api/projects', {
  query: { hubId: selectedHub, projectSearch },
});
</script>
