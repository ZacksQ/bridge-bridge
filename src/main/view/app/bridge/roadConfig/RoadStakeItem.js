import React, {Fragment, useEffect, useState} from "react";
import {Tabs, Modal, Form, Input, Col, Popconfirm, message, Select, Button, Spin, Card} from "antd";

const InputGroup = Input.Group;
const RoadStakeItem = ({ initialValue, value, calcPrice }) => {
        const [active, setActive]= useState(false)
        const [start, setStart]=useState( '')
        const [end, setEnd]= useState('')
        const [selected, setSelectd] = useState(false)

    const handleSelected = () => {
        let curactive = !active
        setActive(curactive)
        setStart('')
        setEnd('')
        setSelectd(true)
    }

    useEffect(()=>{
        if (initialValue) {
            let roads = initialValue.split(",")
            for (let rindex = 0; rindex < roads.length; rindex++) {
                let stake = roads[rindex].split("_")
                if (stake.length > 0 && stake[0] == value) {
                    setActive(true)
                    setStart(stake[1] ? stake[1] : '')
                    setEnd(stake[2] ? stake[2] : '')
                    break
                }
            }
        }
    }, [initialValue])

    useEffect(()=>{
        if(selected == true){
            calcPrice()
            setSelectd(false)
        }
    }, [selected])

    //渲染
    return (
        <div className={"road-stake-item" + (active ? " active" : "")}>
            <div className="roadNo" onClick={() => {
                handleSelected()
            }}>{value}</div>
            {active && <InputGroup compact>
                <Input style={{ width: 100, textAlign: 'center' }} placeholder="开始桩号" defaultValue={start} />
                <Input
                    style={{
                        width: 30,
                        borderLeft: 0,
                        pointerEvents: 'none',
                        backgroundColor: '#fff',
                    }}
                    placeholder="~"
                    disabled
                />
                <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="结束桩号" defaultValue={end} />
                <Button type="primary" onClick={()=>{calcPrice()}}>确认</Button>
            </InputGroup>}
        </div>
    );
};

export default RoadStakeItem;