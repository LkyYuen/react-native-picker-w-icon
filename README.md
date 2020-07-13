# react-native-picker-w-icon

## Getting started

`$ npm install react-native-picker-w-icon --save`

### Mostly automatic installation

`$ react-native link react-native-picker-w-icon`

## Usage
```javascript
import React, { useState } from "react";
import PickerWIcon from 'react-native-picker-w-icon';
import { View, Image, StyleSheet } from "react-native";
import { Icon } from "native-base";

const telCodes = [
  {
    "code": "+60",
    "icon": "https://cdn3.iconfinder.com/data/icons/o-shaped-flag-1/128/O_shaped_asian_flag-21-256.png",
  },
  {
    "code": "+62",
    "icon": "https://cdn3.iconfinder.com/data/icons/o-shaped-flag-1/128/O_shaped_asian_flag-27-128.png",
  },
  {
    "code": "+81",
    "icon": "https://cdn3.iconfinder.com/data/icons/o-shaped-flag-1/128/O_shaped_asian_flag-16-256.png",
  },
]

const PickerWIconApp = props => {

    const [value, setValue] = useState(undefined);

    return (
        <PickerWIcon
            options={telCodes}
            dropdownStyle={{ height: (50 + StyleSheet.hairlineWidth) * telCodes.length }}
            pickerIconStyle={{ color: 'grey', width: 23, height: 28 }}
            defaultValue={telCodes[0]}
            onSelect={(index, value) => setValue(value)}
            iconKey={"icon"}
            labelKey={"code"}
            renderRow={
                <View>
                    <Image
                        source={{ uri: telCodes[0].icon }}
                        style={{ width: 30, height: 30 }}
                        resizeMode={'cover'}
                    />
                    <Text numberOfLines={1}>
                        {telCodes[0].code}
                    </Text>
                    <Icon
                        name="md-arrow-dropdown"
                        style={{ color: 'transparent' }}
                    />
                </View>
            }
        />
    )
}
```
