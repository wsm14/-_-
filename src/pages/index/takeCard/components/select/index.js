import React, {useEffect, useState} from "react";
import Taro from '@tarojs/taro'
import {CoverImage, CoverView, ScrollView} from "@tarojs/components";
import './index.scss'

export default (props) => {
  const {list, onClose, Top = 0, onChange} = props
  const [selectList, setSelectList] = useState(-1)
  const [data, setData] = useState([])
  const [checkedStyle, setCheckedStyle] = useState({})
  const [twoStyle, setTwoStyle] = useState(0)
  useEffect(() => {
    setData(list)
  }, [list])

  const renderIndex = {
    0: () => (<CoverView className='select_box_data' onClick={(e) => e.stopPropagation()}>
      {data[selectList]['data'].map((item) => {
        const {distance, value} = item
        return (
          <CoverView className='select_one_box'>
            <CoverView
              className={checkedStyle.distance === distance ? 'select_checked_dataStyle' : 'select_one_dataStyle'}
              onClick={(e) => {
                e.stopPropagation()
                console.log(checkedStyle.distance, value)
                setCheckedStyle({
                  ...checkedStyle,
                  distance: distance
                })
                onChange('distance', value)
                setSelectList(-1)
              }}>
              {distance}
            </CoverView>
          </CoverView>
        )
      })}
    </CoverView>),
    1: () => {
      return (
        <CoverView className='select_two_box'>
          <CoverView scrollY className='select_test'>
            {data[selectList]['data'].map((item, index) => {
              const {categoryName} = item
              return (
                <CoverView
                  className={twoStyle === index ? 'select_two_dataStyle1 select_two_checked1' : 'select_two_dataStyle1'}
                  onClick={(e) => {
                    e.stopPropagation()
                    setTwoStyle(index)
                  }}>
                  {categoryName}
                </CoverView>
              )
            })}
          </CoverView>
          <CoverView
            scrollY
            className='select_test1'
          >
            {data[selectList]['data'][twoStyle]['categoryDTOList'].map((item, index) => {
              const {categoryName, categoryIdString} = item
              return (
                <CoverView
                  className={checkedStyle.categoryIds === categoryIdString ? 'select_two_dataStyle2 select_two_checked2' : 'select_two_dataStyle2'}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCheckedStyle({
                      ...checkedStyle,
                      categoryIds: categoryIdString,
                      categoryName: categoryName
                    })
                    onChange('categoryIds', categoryIdString)
                    setSelectList(-1)
                  }}>
                  {categoryName}
                </CoverView>
              )
            })}
          </CoverView>
        </CoverView>
      )
    },
    2: () => (<CoverView className='select_box_data' onClick={(e) => e.stopPropagation()}>
      {data[selectList]['data'].map((item) => {
        const {filterType, value} = item
        return (
          <CoverView className='select_one_box'>
            <CoverView
              className={checkedStyle.filterType === filterType ? 'select_checked_dataStyle' : 'select_one_dataStyle'}
              onClick={(e) => {
                e.stopPropagation()
                setCheckedStyle({
                  ...checkedStyle,
                  filterType: filterType
                })
                onChange('filterType', value)
                setSelectList(-1)
              }}>
              {filterType}
            </CoverView>
          </CoverView>
        )
      })}
    </CoverView>),
  }[selectList]
  return (
    <CoverView style={{top: Taro.pxTransform(Top)}} className={selectList !== -1 ? 'select_box' : 'select_little_box'}
               onClick={(e) => {
                 e.stopPropagation();
                 setSelectList(-1)
               }}>
      <CoverView onClick={(e) => {
        e.stopPropagation()
      }} style={{background: "white"}}>
        <CoverView className='select_box_filter'>
          {data.map((item, index) => {
            return (
              <CoverView className='select_check' onClick={(e) => {
                e.stopPropagation();
                if (index === selectList) {
                  return setSelectList(-1)
                }
                setSelectList(index)
              }}>
                <CoverView className={index === selectList ? 'select_checkTo' : 'select_checkFalse'}>
                  {checkedStyle[item['dataIndex']] || item.name}
                </CoverView>
                <CoverImage
                  src={
                    index === selectList ? "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon356.png" : "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon357.png"
                  }
                  className={'select_checkTo_icon'}></CoverImage>
              </CoverView>
            )
          })}
        </CoverView>
        {selectList !== -1 && renderIndex()}
      </CoverView>
    </CoverView>
  )
}
