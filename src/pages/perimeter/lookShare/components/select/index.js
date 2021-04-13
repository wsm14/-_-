/*
* modeFn 改变显示样式传递的方法
* list 分类数组
* visible 状态 type 弹层 status 类型或距离 mode瀑布或者单行
* categoryId 选择分类回显
* limit 距离回显
* limitList 距离 数据源
* tabView 切换分类
* showSelect 打开弹层
* marginTags 标签样式适配
* selectObj 渲染选项对象
* getCategorys 接口获取分类
* 2021 1.14 deng
* */
import React, {useEffect, useState} from 'react'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import {View} from "@tarojs/components";
import {getCategory} from '@/server/common'
import './index.scss'
export default ({modeFn,selects}) => {
  const [visible, setVisible] = useState({
    type: false,
    status: 0,
    mode: 0,
  })
  const [list, setList] = useState([])
  const [categoryId, setCategoryId] = useState({
    categoryId: '',
    categorName: '全部类型'
  })
  const [limit, setLimit] = useState({
    label: '距离排序',
    val: ''
  })
  const limitList = [
    {
      label: '全部',
      val: ''
    },
    {
      label: '500m',
      val: '500'
    },
    {
      label: '1km',
      val: '1000'
    },
    {
      label: '2km',
      val: '2000'
    }, {
      label: '5km',
      val: '5000'
    }, {
      label: '10km',
      val: '10000'
    },]
  useEffect(() => {
    getCategorys()
  }, [])
  const {type, status, mode} = visible
  const tabView = () => {
    if (mode === 0) {
      setVisible({
        ...visible,
        mode: 1
      })
      modeFn && modeFn(1)
    } else {
      setVisible({
        ...visible,
        mode: 0
      })
      modeFn && modeFn(0)
    }
  }
  //切换渲染视图类型
  const showSelect = (num) => {
    if (type === true && status === num) {
      setVisible({
        ...visible,
        type: false
      })
    } else {
      setVisible({
        ...visible,
        type: true,
        status: num
      })
    }
  }
  const marginTags = (list, num, style, components) => {
    return (list.map((item, index) => {
        return (
          <View style={(index + 1) % num !== 0 && style}>
            {components(item, index)}
          </View>
        )
      })
    )
  }
  const getCategorys = () => {
    getCategory({parentId: '0'}, res => {
      const {categoryDTOList} = res
      setList([{categoryIdString: "", categoryName: "全部类型"}, ...categoryDTOList])
    })
  }
  const selectObj = {
    0: () => (<View className='select_tags_share'>
      {marginTags(list, 4, {marginRight: Taro.pxTransform(42)}, (item, index) => {
        return (
          <View onClick={() => {
            setCategoryId({
              categoryId: item.categoryIdString,
              categorName: item.categoryName
            });
            selects({categoryId: item.categoryIdString})
            setVisible({...visible, type: false})
          }}
                className={classNames('select_tags_box', categoryId.categoryId === item.categoryIdString ? 'select_tags_color1' : 'select_tags_color2')}>{item.categoryName}</View>
        )
      })}
    </View>),

    1: () => {
      return limitList.map(item => {
        return (
          <View
            className={classNames('select_tags_limit', limit.val === item.val ? 'select_tags_colors2' : 'select_tags_colors1')}
            onClick={() => {
              setLimit({
                label: item.label,
                val: item.val
              })
              setVisible({...visible, type: false})
              selects({distance: item.val})
            }}>{item.label}</View>
        )
      })
    },
  }[status]
  return (
    <>
      <View className='select_share_box'>
        <View className='select_share_content'>
          <View onClick={() => showSelect(0)}
                className={classNames('select_tab_box', (type && status === 0) ? 'select_tab_color2' : 'select_tab_color1')}>
            <View className='select_tab_font bold'>{categoryId.categorName}</View>
            <View
              className={classNames('select_icon_box', (type && status === 0) ? 'select_icon2' : 'select_icon1')}></View>
          </View>
          <View onClick={() => showSelect(1)}
                className={classNames('select_tab_box', (type && status === 1) ? 'select_tab_color2' : 'select_tab_color1')}>
            <View className='select_tab_font bold'>{limit.label}</View>
            <View
              className={classNames('select_icon_box', (type && status === 1) ? 'select_icon2' : 'select_icon1')}></View>
          </View>
          <View className={classNames(mode === 0 ? 'select_share_cat' : 'select_share_shu')}
                onClick={() => tabView()}></View>
        </View>
      </View>
      {type && <View className='select_share_layer' onClick={(e) => {
        e.stopPropagation();
        setVisible({
          ...visible,
          type: false
        })
      }}>
        <View className='select_share_check' onClick={(e) => {
          e.stopPropagation()
        }}>
          {selectObj()}
        </View>
      </View>}
    </>

  )
}
