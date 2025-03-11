import { createVNode, render } from 'vue'
import AlertDialogVue from './AlertDialog.vue'

export interface AlertDialogOptions {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  showCancelButton?: boolean
}

let container: HTMLElement | null = null

export const AlertDialog = {
  open(options: AlertDialogOptions) {
    if (!container) {
      container = document.createElement('div')
      document.body.appendChild(container)
    }

    const vnode = createVNode(AlertDialogVue, {
      ...options,
      onClose: () => {
        render(null, container!)
      },
    })

    render(vnode, container)
  },
}
