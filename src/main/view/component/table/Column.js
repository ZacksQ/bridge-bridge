import React from "react";
import {Button, Input} from "antd";
import Highlighter from "react-highlight-words";
import ExpandableTree from "../tree/ExpandableTree";
import AsyncTreeSelect from "../tree/AsyncTreeSelect";
import {SearchOutlined} from '@ant-design/icons';

/**
 * 返回搜索列属性
 * @param searchText  搜索文字，数组
 * @param binaryOperator  二元操作符，参数为字符串和对象，返回字符串，用于将对象转换为字符串
 * @returns {{filterDropdown: (function({setSelectedKeys: *, selectedKeys: *, confirm: *, clearFilters: *}): *), filterIcon: (function(*): *), render: (function(*): *)}}
 */
const getColumnSearchProps = (searchText, binaryOperator) => {
    return {
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    placeholder="输入检索内容"
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={confirm}
                    style={{width: 188, marginBottom: 8, display: "block"}}
                />
                <Button
                    type="primary"
                    onClick={confirm}
                    icon={<SearchOutlined/>}
                    size="small"
                    style={{width: 90, marginRight: 8}}>
                    搜索
                </Button>
                <Button
                    size="small"
                    style={{width: 90}}
                    onClick={clearFilters}>
                    清除
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined style={{color: filtered ? "#1890ff" : undefined}}/>
        ),
        render: (text, data) => (
            <Highlighter
                searchWords={Array.isArray(searchText) ? searchText : []}
                textToHighlight={binaryOperator ? binaryOperator(text, data) : text ? text.toString() : ""}
                highlightStyle={{backgroundColor: "#ffc069", padding:0}}
                autoEscape
            />
        )
    };
}

/** 返回树形选择框 */
const getColumnsTreeSelectProps = treeData => {
    return {
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <ExpandableTree
                    treeData={treeData}
                    selectedKeys={selectedKeys}
                    onSelect={selectedKeys => {
                        if (selectedKeys.length > 0) {
                            setSelectedKeys(selectedKeys);
                            confirm();
                        } else {
                            clearFilters();
                        }
                    }}
                    showLine={false}
                />
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined style={{color: filtered ? "#1890ff" : undefined}}/>
        )
    };
}

/** 范围输入框 */
const getColumnsRangeProps = () => {
    return {
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input.Group style={{width: 190, marginBottom: 8, display: "block"}} compact>
                    <Input style={{ width: 80, textAlign: 'center' }} value={selectedKeys[0]} placeholder="最小值" onChange={e => setSelectedKeys([e.target.value, selectedKeys[1]])}/>
                    <Input style={{width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff'}} placeholder="~" disabled/>
                    <Input style={{ width: 80, textAlign: 'center', borderLeft: 0 }} value={selectedKeys[1]} placeholder="最大值" onChange={e => setSelectedKeys([selectedKeys[0], e.target.value])}/>
                </Input.Group>
                <Button
                    type="primary"
                    onClick={confirm}
                    icon={<SearchOutlined/>}
                    size="small"
                    style={{width: 90, marginRight: 8}}>
                    搜索
                </Button>
                <Button
                    size="small"
                    style={{width: 90}}
                    onClick={clearFilters}>
                    清除
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined style={{color: filtered ? "#1890ff" : undefined}}/>
        )
    };
}

/** 返回树形选择框异步加载 */
const getColumnsTreeSelectAsyncProps = treeData => {
    return {
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <AsyncTreeSelect
                    treeData={treeData}
                    selectedKeys={selectedKeys}
                    onSelect={selectedKeys => {
                        if (selectedKeys.length > 0) {
                            setSelectedKeys(selectedKeys);
                            confirm();
                        } else {
                            clearFilters();
                        }
                    }}
                    showLine={false}
                />
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined style={{color: filtered ? "#1890ff" : undefined}}/>
        )
    };
}

export {getColumnSearchProps, getColumnsTreeSelectProps, getColumnsRangeProps, getColumnsTreeSelectAsyncProps}