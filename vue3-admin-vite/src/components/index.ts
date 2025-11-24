import vCharts from './v-charts/v-charts.vue'
import TableList from './TableList/TableList.vue'
import SearchForm from './SearchForm/SearchForm.vue'

const components = [SearchForm, TableList, vCharts]

const install = function (Vue: any) {
  components.forEach((app) => {
    Vue.component(app.name, app)
  })
}

export default install
