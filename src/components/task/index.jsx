import React, { useState, useEffect, useImperativeHandle } from "react";
import { useRouter } from "@tarojs/taro";
import { Video, View } from "@tarojs/components";
import { fetchTaskDetail, fetchDoneTask, fakeBoxPrize } from "@/server/share";
import { goBack, toast } from "@/common/utils";
import "./index.scss";
let intervalTime = null;
export default (props) => {
  const { useRef, createType = false } = props;
  const [visible, setVisible] = useState(false);
  const [gameInfo, setGameInfo] = useState("sign");
  const [taskInfo, setTaskInfo] = useState({});
  const [blindStatus, setBlind] = useState(true);
  const [task, setTask] = useState({
    type: null,
    count: null,
    uploadCount: 0,
  });
  const routeParams = useRouter().params;
  const { strapId = "", blindBox = false, gameType = "sign" } = routeParams;
  useEffect(() => {
    if (gameType) {
      setGameInfo(gameType);
    }
  }, [gameType]);
  useImperativeHandle(useRef, () => ({
    updateTask: () => {
      if (
        !createType &&
        task.count !== task.uploadCount &&
        taskInfo.taskStatus === "0"
      ) {
        setTask({
          ...task,
          uploadCount: task.uploadCount + 1,
        });
      } else if (blindStatus && blindBox) {
        setBlind(() => {
          fakeBoxPrize({
            helpFlag: "0",
          }).then((val) => {
            toast("已领取盲盒奖励");
          });
          return false;
        });
      }
    },
  }));
  useEffect(() => {
    if (strapId) {
      fetchTask();
    }
  }, []);
  const templateFont = () => {
    const { type } = task;
    if (type === "browerTime") {
      return `浏览${task.count - task.uploadCount}S领取`;
    } else return `${task.uploadCount}/${task.count}`;
  };
  const filterBottomText = () => {
    const { taskStatus } = taskInfo;
    if (taskStatus === "0") {
      return templateFont();
    } else if (taskStatus === "1") {
      return "立即领取";
    } else {
      return `已领取${gameInfo === "sign" ? "成长值" : "星豆"}`;
    }
  };
  const fetchTask = () => {
    fetchTaskDetail({
      strapId,
    }).then((val) => {
      const { taskInfo } = val;
      const { receiveRule } = taskInfo;
      let receJson = receiveRule ? JSON.parse(receiveRule) : {};
      const { type } = receJson;
      if (type === "browerTime" || type === "browers") {
        setVisible(() => {
          setTaskInfo(taskInfo);
          return true;
        });
      }
    });
  };
  useEffect(() => {
    const { receiveRule, taskStatus } = taskInfo;
    if (receiveRule && JSON.parse(receiveRule) && taskStatus === "0") {
      let rule = JSON.parse(receiveRule);
      const { type, condition } = rule;
      if (type === "browerTime") {
        let num = 0;
        setTask({
          type,
          count: condition,
          uploadCount: 0,
        });
        intervalTime = setInterval(() => {
          num += 1;
          console.log(11111);
          if (num <= condition) {
            setTask({
              type,
              count: condition,
              uploadCount: num,
            });
          } else {
            clearInterval(intervalTime);
            intervalTime = null;
          }
        }, 1000);
      } else {
        setTask({
          ...task,
          type,
          count: condition,
        });
      }
    }
  }, [taskInfo]);
  useEffect(() => {
    const { count, uploadCount } = task;
    const { strapId } = taskInfo;
    if (count == uploadCount) {
      fetchDoneTask({ taskStrapId: strapId }).then((val) => {
        fetchTask();
      });
    }
  }, [task]);
  if (visible) {
    const { rewardNum } = taskInfo;
    return (
      <View
        onClick={() => {
          goBack();
        }}
        className="task_view"
      >
        <View className={gameInfo === "sign" ? "task_icon" : "task_icon_free"}>
          <View className="task_reload_count">+{rewardNum}</View>
        </View>
        <View className="task_toast public_center">{filterBottomText()}</View>
      </View>
    );
  } else {
    return null;
  }
};
