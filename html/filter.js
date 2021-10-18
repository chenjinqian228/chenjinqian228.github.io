const template = `<div><template>
<div class="my-filter-excel">
  <div class="my-fe-top">
    <ul class="my-fe-menu-group">
      <li class="my-fe-menu-link">
        <span>升序</span>
      </li>
      <li class="my-fe-menu-link">
        <span>倒序</span>
      </li>
    </ul>
    <ul class="my-fe-menu-group">
      <li class="my-fe-menu-link" @click="resetFilterEvent">
        <span>清除筛选</span>
      </li>
      <li class="my-fe-menu-link">
        <i class="fa fa-filter my-fe-menu-link-left-icon"></i>
        <span>筛选条件</span>
        <i class="fa fa-caret-right my-fe-menu-link-right-icon"></i>
        <div class="my-fe-menu-child-list">
          <ul class="my-fe-child-menu-group-list" v-for="(cList, gIndex) in caseGroups" :key="gIndex">
            <li v-for="(cItem, cIndex) in cList" :key="cIndex" class="my-fe-child-menu-item" @click="childMenuClickEvent(cItem)">
              <span>{{ cItem.label }}</span>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
  <div class="my-fe-search">
    <div class="my-fe-search-top">
      <input v-model="option.data.sVal" placeholder="搜索"/>
      <i class="fa fa-search my-fe-search-icon"></i>
    </div>
    <ul class="my-fe-search-list">
      <li class="my-fe-search-item" @click="sAllEvent">
        <i class="fa fa-square-o my-fe-search-item-icon"></i>
        <span>(全选)</span>
      </li>
      <li class="my-fe-search-item" v-for="(val, sIndex) in searchList" :key="sIndex" @click="sItemEvent(val)">
        <i :class="[option.data.vals.indexOf(val) === -1 ? 'fa fa-square-o my-fe-search-item-icon' : 'fa fa-check-square-o my-fe-search-item-icon']"></i>
        <span>{{ val }}</span>
      </li>
    </ul>
  </div>
  <div class="my-fe-footer">
    <vxe-button status="primary" @click="confirmFilterEvent">确认</vxe-button>
    <vxe-button @click="resetFilterEvent">重置</vxe-button>
  </div>
</div>
</template></div>`;

Vue.component("filter-input", {
  template: template,
  props: {
    params: Object,
  },
  data: function () {
    return {
      column: null,
      option: null,
      colValList: [],
      caseGroups: [
        [
          { value: "equal", label: "等于" },
          { value: "ne", label: "不等于" },
        ],
        [
          { value: "greater", label: "大于" },
          { value: "ge", label: "大于或等于" },
          { value: "less", label: "小于" },
          { value: "le", label: "小于或等于" },
        ],
      ],
    };
  },
  computed: {
    searchList() {
      const { option, colValList } = this;
      return option.data.sVal
        ? colValList.filter((val) => val.indexOf(option.data.sVal) > -1)
        : colValList;
    },
  },
  created() {
      console.log(this.params);
    this.load();
  },
  methods: {
    load() {
      const { $table, column } = this.params;
      const { fullData } = $table.getTableData();
      const option = column.filters[0];
      const colValList = Object.keys(
        XEUtils.groupBy(fullData, column.property)
      );
      this.column = column;
      this.option = option;
      this.colValList = colValList;
    },
    sAllEvent() {
      const { data } = this.option;
      if (data.vals.length > 0) {
        data.vals = [];
      } else {
        data.vals = this.colValList;
      }
    },
    sItemEvent(val) {
      const { data } = this.option;
      const vIndex = data.vals.indexOf(val);
      if (vIndex === -1) {
        data.vals.push(val);
      } else {
        data.vals.splice(vIndex, 1);
      }
    },
    confirmFilterEvent(evnt) {
      const { params, option } = this;
      const { data } = option;
      const { $panel } = params;
      data.f1 = "";
      data.f2 = "";
      $panel.changeOption(evnt, true, option);
      $panel.confirmFilter();

    },
    resetFilterEvent() {
      const { $panel } = this.params;
      $panel.resetFilter();
    },
    childMenuClickEvent(cItem) {
      this.$XModal.alert({ content: cItem.label });
    },
  },
});


VXETable.renderer.add('FilterExtend', {
    // 不显示底部按钮，使用自定义的按钮
    isFooter: false,
    // 筛选模板
    renderFilter (h, renderOpts, params) {
        console.log(h);
        console.log(params);
        console.log(renderOpts);

      return [
        h('filter-input',{
            props:{
                params:params
            } 
        })
      ]
    },
    // 重置数据方法
    filterResetMethod ({ options }) {
      options.forEach(option => {
        option.data = { vals: [], sVal: '', fMenu: '', f1Type: '', f1Val: '', fMode: 'and', f2Type: '', f2Val: '' }
      })
    },
    // 筛选数据方法
    // filterMethod ({ option, row, column }) {
    //   const cellValue = row[column.property]
    //   const { vals, f1Type, f1Val } = option.data
    //   console.log(123123);
    //   if (cellValue) {
    //     if (f1Type) {
    //       return cellValue.indexOf(f1Val) > -1
    //     } else if (vals.length) {
    //       // 通过指定值筛选
    //       return vals.includes(cellValue)
    //     }
    //   }
    //   return false
    // }
  })
