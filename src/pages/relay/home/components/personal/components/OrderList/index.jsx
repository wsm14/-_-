import React, { useEffect, useState } from "react";
import { View, Text, Button } from "@tarojs/components";
import {
  handleOrdertools,
  handleGoGroupEdit,
  handleGroupDelete,
  handleGroupDoTop,
  handleGoGroupDetail,
} from "@/relay/common/hooks";
import { toast, loginStatus } from "@/common/utils";
import { GROUP_STATUS } from "@/relay/common/constant";
import ImageShow from "@/relay/components/ImageShow";
import TabPane from "@/relay/components/TabPane";
import ShareInfo from "@/relay/components/shareInfo";
import { getShareInfo } from "@/server/common";
import "./index.scss";

export default ({ list, navHeight, getNewData, index }) => {
  const toolsArr = (item) => {
    const { communityOrganizationId, ownerId, topFlag } = item;
    return [
      {
        name: "置顶",
        disabled: topFlag === 1,
        show: topFlag === 0,
        onClick: (e) => {
          e.stopPropagation();
          handleGroupDoTop({ communityOrganizationId, ownerId }, () => {
            toast("置顶成功");
            getNewData();
          });
        },
      },
      {
        name: "取消置顶",
        disabled: topFlag === 0,
        show: topFlag === 1,
        onClick: (e) => {
          e.stopPropagation();
          handleGroupDoTop(
            { communityOrganizationId, ownerId, topFlag },
            () => {
              toast("取消置顶成功");
              getNewData();
            }
          );
        },
      },
      {
        name: "修改",
        show: true,
        onClick: (e) => {
          e.stopPropagation();
          handleGoGroupEdit({ communityOrganizationId, ownerId });
        },
      },
      {
        name: "删除",
        show: true,
        onClick: (e) => {
          e.stopPropagation();
          handleGroupDelete({ communityOrganizationId, ownerId }, getNewData);
        },
      },
    ];
  };
  const [visible, setVisible] = useState(false);
  const [shareData, setShareData] = useState({});
  useEffect(() => {
    if (!visible) {
      setShareData({});
    }
  }, [visible]);
  const shareInfo = (val) => {
    const { communityOrganizationId, ownerId } = val;
    if (!loginStatus()) {
    } else {
      getShareInfo(
        {
          shareType: "communityGoods",
          shareId: communityOrganizationId,
          shardingKey: ownerId,
        },
        (res) => {
          setVisible(true);
          setShareData(res);
        }
      );
    }
  };
  return (
    <View className="pu_order">
      <View className="pu_order_tab" style={{ top: navHeight }}>
        <TabPane
          list={GROUP_STATUS}
          className="tabBarMargin"
          onClick={(key) => getNewData({ communityStatus: key })}
        ></TabPane>
      </View>
      <View className="pu_order_group">
        {list.map((item) => (
          <View
            className="pu_order_cell"
            onClick={(e) => {
              e.stopPropagation();
              const {
                communityOrganizationId,
                ownerId,
                settleAmount,
                viewCount,
              } = item;
              handleGoGroupDetail({
                communityOrganizationId,
                ownerId,
                settleAmount,
                viewCount,
              });
            }}
          >
            <View className="pu_order_heard">
              {/* 创建时间 */}
              <View className="pu_heard_date">{item.createTime}</View>
              <View className="pu_heard_footer">
                {toolsArr(item).map(
                  (i) =>
                    i.show && (
                      <View
                        className={`pu_heard_tools ${
                          i.disabled ? "pu_tools_disabled" : ""
                        }`}
                        onClick={!i.disabled ? i.onClick : () => {}}
                      >
                        {i.name}
                      </View>
                    )
                )}
              </View>
            </View>
            <View className="pu_order_info">
              <View className="pu_order_content">
                <View className="pu_order_name">
                  {/* 团购名称 */}
                  <View className="puon_name">{item.title}</View>
                  {/* 团购金额 */}
                  <View className="puon_price">{item.price}</View>
                </View>
                {/* 图片集合 */}
                {item.communityImages && (
                  <View className="pu_order_img">
                    <ImageShow
                      width={194}
                      src={item.communityImages}
                    ></ImageShow>
                  </View>
                )}
                <View className="pu_content_footer">
                  {/* 团购状态 */}
                  <View className={`pu_order_status ${item.communityStatus}`}>
                    {GROUP_STATUS[item.communityStatus]}
                  </View>
                  <View
                    className="pu_order_share"
                    onClick={(e) => {
                      e.stopPropagation();
                      shareInfo(item);
                    }}
                  ></View>
                </View>
              </View>
              <View className="pu_order_footer">
                <View className="pu_order_income">
                  <View>
                    <Text>实际收入 ¥{item.settleAmount}</Text>
                    <Text>退款金额 ¥{item.refundAmount}</Text>
                  </View>
                  <View>
                    <Text>已跟团{item.buyCount}人次</Text>
                    <Text>取消跟团{item.refundCount}人次</Text>
                    <Text>查看{item.viewCount}人</Text>
                  </View>
                </View>
                <Button
                  className="pu_order_tools"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOrdertools(item, getNewData);
                  }}
                >
                  <View className="pu_tools_radio"></View>
                  <View className="pu_tools_radio"></View>
                  <View className="pu_tools_radio"></View>
                </Button>
              </View>
            </View>
          </View>
        ))}
        {!list.length ? <View className="pu_order_null">没有更多了</View> : ""}
        {index === 3 && (
          <ShareInfo
            onClose={() => {
              setVisible(false);
            }}
            show={visible}
            data={shareData}
          ></ShareInfo>
        )}
      </View>
    </View>
  );
};
