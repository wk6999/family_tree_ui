/* global window */
import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import api from 'api'
import { pageModel } from 'utils/model'

const {
  queryCategoryContentByPage,
  queryCategoryContentById,
  createCategoryContent,
  removeCategoryContent,
  updateCategoryContent,
  removeCategoryContentList,
  getCategoryList,
} = api

export default modelExtend(pageModel, {
  namespace: 'categoryContent',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    categoryListData: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        console.log('list')
        console.log(location.pathname)
        const match = pathMatchRegexp(
          '/folk/categorycontent',
          location.pathname
        )
        if (match) {
          const payload = location.query || {
            page: 1,
            pageSize: 10,
          }
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      const result = yield call(queryCategoryContentByPage, payload)
      const { success, message, status, data } = result
      if (success) {
        let { pageNumber, pageSize, total, result } = data
        yield put({
          type: 'querySuccess',
          payload: {
            list: result,
            pagination: {
              current: Number(pageNumber) || 1,
              pageSize: Number(pageSize) || 10,
              total: Number(total),
            },
          },
        })
      }
    },

    *delete({ payload }, { call, put, select }) {
      const data = yield call(removeCategoryContent, { ids: [payload] })
      const { selectedRowKeys } = yield select(_ => _.categorycontent)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload),
          },
        })
      } else {
        throw data
      }
    },

    *multiDelete({ payload }, { call, put }) {
      const data = yield call(removeCategoryContentList, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
      } else {
        throw data
      }
    },

    *create({ payload }, { call, put }) {
      const data = yield call(createCategoryContent, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    *update({ payload }, { select, call, put }) {
      const id = yield select(
        ({ categorycontent }) => categorycontent.currentItem.id
      )
      const newCategoryContent = { ...payload, id }
      const data = yield call(updateCategoryContent, newCategoryContent)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    get: function*({ payload }, { call, put, select }) {
      const resp = yield call(queryCategoryContentById, { id: payload })
      if (resp.success) {
        yield put({
          type: 'showModal',
          payload: {
            modalType: 'update',
            currentItem: resp.data,
            editorContent: resp.data.content,
          },
        })
      } else {
        throw resp
      }
    },
    getCategoryList: function*({ payload }, { call, put, select }) {
      const resp = yield call(getCategoryList, payload)
      if (resp.success) {
        console.log(resp)
        yield put({
          type: 'updateState',
          payload: { categoryListData: resp.data },
        })
      } else {
        throw resp
      }
    },
  },

  reducers: {
    showModal(state, { payload }) {
      return {
        ...state,
        ...payload,
        modalVisible: true,
      }
    },

    hideModal(state) {
      return { ...state, modalVisible: false }
    },
  },
})
