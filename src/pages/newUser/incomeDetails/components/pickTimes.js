import React, {useState, useEffect, useImperativeHandle} from 'react'
import {View, PickerView, PickerViewColumn} from "@tarojs/components";
import Taro from '@tarojs/taro'
import './pickTime.scss'
import {values} from "mobx";

const timestamp = Date.parse(new Date());
const date = new Date(timestamp);
//获取年份
const nowsYears = date.getFullYear();
//获取月份
const nowsMounts = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);

const filterDate = (list, years) => {
  return list.map((item, index) => {
    if (item == years) {
      return index
    } else return false
  }).filter(item => {
    return item !== false
  })
}
const PickTime = (props) => {
  const {cRef} = props
  const years = ['2020', '2021']
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  const [value, setValue] = useState([...filterDate(years, nowsYears), ...filterDate(months, nowsMounts)])
  const onChange = (e) => {
    const {detail} = e
    setValue(detail.value)
  }
  useImperativeHandle(cRef, () => ({
    getTimes: () => {
      return {
        gainMonth: years[value[0]] + '-' + months[value[1]]
      }
    }
  }))
  return (
    <PickerView indicatorClass="PickerView_indicator" className='pickViewStyle' value={value}
                onChange={(e) => onChange(e)}>
      <PickerViewColumn>
        {years.map(item => {
          return (
            <View className={'indicatorClass'}>{item + ' '}年</View>
          );
        })}
      </PickerViewColumn>
      <PickerViewColumn>
        {months.map(item => {
          return (
            <View className={'indicatorClass font32 bold color1'}>{item + ' '}月</View>
          )
        })}
      </PickerViewColumn>
    </PickerView>
  )
}
export default PickTime
