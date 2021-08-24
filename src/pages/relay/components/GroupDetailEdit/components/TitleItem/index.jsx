import React, { useContext } from "react";
import update from "immutability-helper";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { EditContext } from "../../editStore";
import { uploadImg } from "../utils";
import "./index.scss";

/**
 * 编辑模块 - 块级标题&工具栏
 * @param {Boolean} textEditStatus 文本框编辑状态 编辑中不可移动数据
 * @param {Array} dataArr 数据源
 * @param {Function} setDataArr 保存数据源
 */
export default ({ title, index }) => {
  const { textEditStatus, dataArr, setDataArr } = useContext(EditContext);

  // 数据移位
  const moveData = (newIndex) => {
    setDataArr((old) => {
      const row = old[index];
      return update(old, {
        $splice: [
          [index, 1],
          [newIndex, 0, row],
        ],
      });
    });
  };

  // 数据添加
  const addData = (data) => {
    setDataArr((old) => {
      return update(old, {
        $splice: [[index + 1, 0, data]],
      });
    });
  };

  const toolsArr = [
    {
      name: "上移",
      disabled: index === 0 || textEditStatus,
      onClick: () => moveData(index - 1),
    },
    {
      name: "下移",
      disabled: index === dataArr.length - 1 || textEditStatus,
      onClick: () => moveData(index + 1),
    },
    {
      name: "置顶",
      disabled: index === 0 || textEditStatus,
      onClick: () => moveData(0),
    },
    {
      name: "添加",
      onClick: () =>
        Taro.showActionSheet({
          itemList: ["向下添加大图", "向下添加小图", "向下添加文字"],
          success(res) {
            const { tapIndex } = res;
            switch (tapIndex) {
              case 0:
                uploadImg("largePicture", addData);
                break;
              case 1:
                uploadImg("smallPicture", addData);
                break;
              default:
                addData({ type: "textarea" });
                break;
            }
          },
        }),
    },
    {
      name: "删除",
      onClick: () =>
        Taro.showModal({
          confirmText: "确定",
          confirmColor: "#07c0c2",
          content: "确认删除该模块内容？",
          success: function (res) {
            if (res.confirm) {
              setDataArr(update(dataArr, { $splice: [[index, 1]] }));
            }
          },
        }),
    },
  ];

  return (
    <View className="gd_edit_title_tools">
      <View className="gd_edit_title">{title}</View>
      <View className="gedit_title_tools">
        {toolsArr.map((i) => (
          <View
            className={`gedit_tools_cell ${
              i.disabled ? "gedit_tools_disabled" : ""
            }`}
            onClick={!i.disabled ? i.onClick : () => {}}
          >
            {i.name}
          </View>
        ))}
      </View>
    </View>
  );
};
