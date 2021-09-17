import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Textarea,
  Text,
  Image,
  RichText,
  ScrollView,
  Input,
} from "@tarojs/components";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { fetchMomentComment, fakeMomentComment } from "@/server/index";
import "./index.scss";
export default ({ show = false, close, data, current }) => {
  const [keyword, setWord] = useState(null);
  const [comment, setComment] = useState([]);
  const [root, setRoot] = useState(true);
  const [page, setPage] = useState({
    page: 1,
    limit: 10,
  });
  useEffect(() => {
    if (show) {
      Taro.hideTabBar();
      !comment.length && getComment();
    } else {
      Taro.showTabBar();
    }
  }, [show]);
  useEffect(() => {
    setComment([]);
    setPage({
      page: 1,
      limit: 10,
    });
    setRoot(true);
  }, [current]);
  useEffect(() => {
    if (page.page !== 1) {
      getComment();
    }
  }, [page.page]);
  const setKeyWord = (val) => {
    const { value } = val.detail;
    setWord(value);
  };
  const getComment = () => {
    fetchMomentComment({ ...page, momentId: data.momentId }).then((val) => {
      const { momentCommentList = [] } = val;
      if (!momentCommentList.length) {
        return setRoot(false);
      }
      setComment([...comment, ...momentCommentList]);
    });
  };
  const saveComment = () => {
    fakeMomentComment({
      momentId: data.momentId,
      content: keyword,
      ownerId: data.ownerId,
    }).then((val) => {
      const { momentCommentInfo } = val;
      setComment([momentCommentInfo, ...comment]);
      setWord("");
    });
  };
  const temPlateComment = (item) => {
    const { content = "", username, profile = "", createTime } = item;
    return (
      <View className="temPlateComment_box">
        <View className="temPlateComment_profile">
          <Image
            className="temPlateComment_profile"
            lazyLoad
            mode={"aspectFill"}
            src={profile}
          ></Image>
        </View>
        <View className="temPlateComment_content">
          <View className="temPlateComment_username font_hide">{username}</View>
          <RichText
            nodes={content.replace(
              /\[(.*?)]/g,
              `<img
               width=${Taro.pxTransform(24)}
              src="https://wechat-config.dakale.net/miniprogram/emijo/$1.png"
            ></img>`
            )}
            className="temPlateComment_desc"
          ></RichText>
          <View className="temPlateComment_time">{createTime}</View>
        </View>
      </View>
    );
  };
  const memo = useMemo(() => {
    return (
      <View
        className="comment_box"
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
        style={{ display: show ? "flex" : "none" }}
      >
        <View
          className="comment_content_box"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <View className="comment_content_top">
            {comment.length}条评论
            <View
              className="comment_content_close"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
            ></View>
          </View>
          <ScrollView
            onScrollToLower={() => {
              root &&
                setPage({
                  ...page,
                  page: page.page + 1,
                });
            }}
            scrollY
            className="comment_content_scroll"
          >
            {comment.map((item) => {
              return temPlateComment(item);
            })}
            {!root && (
              <View className="comment_content_root">没有更多了...</View>
            )}
          </ScrollView>

          <View className="comment_bottom_box">
            <Input
              placeholder={"快来发表你的评论吧"}
              type="text"
              maxlength={100}
              onInput={setKeyWord}
              value={keyword}
              className="Textarea_box"
              confirmType={"done"}
            ></Input>

            <View
              className="comment_bottom_btn public_center"
              onClick={() => saveComment()}
            >
              发表
            </View>
          </View>
        </View>
      </View>
    );
  }, [keyword, comment, show, root]);
  return memo;
};
