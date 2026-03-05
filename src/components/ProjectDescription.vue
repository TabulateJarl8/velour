<script setup lang="ts">
import { ref } from 'vue'

const modalRef = ref<HTMLDialogElement | null>(null)

const showModal = () => {
  modalRef.value?.showModal()
}

defineExpose({ showModal })
</script>

<!-- maybe theres a better way to do this but im not sure -->
<!-- https://medium.com/@dimeji.ogunleye20/creating-a-modal-using-vue-refs-and-html-dialogue-element-342b3f25832e -->
<template>
  <dialog ref="modalRef" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-xl mb-4 text-primary">About Velour</h3>
      <p class="py-2 text-sm text-base-content/80 leading-relaxed">
        Velour is a web-based utility which generates customized, post-installation setup scripts
        for Fedora Linux. It provides a large selection of system tweaks/improvements, application
        installations, and other various configurations. The generated scripts are designed to be
        spin-agnostic and safe in cases where it's not applicable to your chosen Fedora
        distribution.
      </p>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-soft btn-primary">Close</button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
