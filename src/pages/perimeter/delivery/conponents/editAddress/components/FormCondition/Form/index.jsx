/*
 * */
import React from "react";
import { View, Text, Form, Button } from "@tarojs/components";
import "../index.scss";
export const FormBlock = ({
  onSubmit,
  submitClass,
  footer = true,
  submitText,
  children,
  footerBtn,
  borderRadius = true,
}) => (
  <Form onSubmit={onSubmit}>
    <View
      className="form_block"
      style={borderRadius ? {} : { borderRadius: 0 }}
    >
      {children}
    </View>
    {footerBtn
      ? footerBtn
      : footer && (
          <View className="formComponents_footer">
            <Button formType="submit" className={`subimtBtn ${submitClass}`}>
              {submitText || "保存"}
            </Button>
          </View>
        )}
  </Form>
);

export const Group = ({ title, tip, extra, children }) => (
  <View className="form_group">
    {title && (
      <View className="form_group_title">
        <View style={{ flex: 1 }}>
          {title}
          {tip && <Text className="title_exrt">{tip}</Text>}
        </View>
        {extra}
      </View>
    )}
    {children}
  </View>
);

export const Item = ({
  label,
  showLabel = true,
  vertical,
  titleTip,
  titleMsg,
  required,
  onClick,
  children,
  verticalForm,
  after,
  extra,
  left = false,
  linerFlag = true,
}) => {
  return (
    <View
      className={`form_cell`}
      onClick={(e) => {
        onClick && onClick(e);
      }}
    >
      <View className={linerFlag ? "form_cell_item" : "form_cell_itemFlag"}>
        {showLabel && (
          <View className={`form_cell_title`}>
            {/* 表单名称 */}
            <View className={`cell_title ${required ? "required" : ""}`}>
              {label}
            </View>
            {titleTip && (
              <View className="form_cell_title_tip">{titleTip}</View>
            )}
          </View>
        )}
        {((!vertical && children) || (vertical && verticalForm)) && (
          <View
            className={!left ? `form_cell_content` : "form_cell_contentLeft"}
          >
            {/* 表单输入块 */}
            {!vertical && children}
            {vertical && verticalForm}
          </View>
        )}
        {after && after()}
      </View>
      {titleMsg && <View className="form_cell_title_msg">{titleMsg}</View>}
      {vertical && children}
      {extra && <View className="form_cell_extra_msg">{extra}</View>}
    </View>
  );
};

FormBlock.Item = Item;

FormBlock.Group = Group;

export default FormBlock;
