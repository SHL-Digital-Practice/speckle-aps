<template>
  <div>
    <dialog
      id="models_modal"
      class="modal"
      :class="[isModalOpen ? 'modal-open' : '']"
    >
      <div class="modal-box">
        <h3 class="font-bold text-lg">{{ project.name }}</h3>
        <p class="py-4">ID: {{ project.id }}</p>
        <form method="dialog">
          <div class="flex" v-for="content in data">
            <label :for="content.id" class="label cursor-pointer">
              <span class="label-text">{{ content.name }}</span>
            </label>
            <input
              type="checkbox"
              class="checkbox checkbox-primary"
              :id="content.id"
              :value="content.id"
              v-model="checkedFiles"
            />
          </div>
          <!-- if there is a button in form, it will close the modal -->
        </form>
        <div class="modal-action">
          <button class="btn" @click="closeModal">Close</button>
          <button class="btn btn-primary" @click="closeModal">Add</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import type { Project } from '~/server/api/projects';

export type ModelsModalProps = {
  project: Project;
};

const isModalOpen = defineModel<boolean>('open');
const props = defineProps<ModelsModalProps>();

const closeModal = () => {
  isModalOpen.value = false;
};

const checkedFiles = ref([]);

watchEffect(() => {
  console.log(checkedFiles.value);
});

const { data, pending, refresh } = await useFetch(
  () => `/api/project/${props.project.id}`,
  {
    params: {
      hubId: props.project.hubId,
    },
  },
);
</script>

<style scoped></style>
