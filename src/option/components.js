
import { website } from '@/config.js'

let requireComponent = require.context('./components', false, /\w+.(vue|js)$/)

let components = {}
const key = "Option"

requireComponent.keys().forEach(fileName => {
  const cmp = requireComponent(fileName).default
  components[cmp.name + key] = cmp
})

requireComponent = require.context('../components', true, /\w+.(vue|js)$/)


requireComponent.keys().forEach(fileName => {
  if (fileName.includes('option.vue')) {
    const cmp = requireComponent(fileName).default
    components[cmp.name + key] = cmp
  }
})

website.componentsList.map(ele => ele.option).forEach(cmp => {
  try {
    cmp = eval(cmp)
    components[cmp.name + key] = cmp
  } catch (err) {
    console.log(err)
  }

})

export default {
  components: components
}