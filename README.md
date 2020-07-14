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
        defaultValue={telCodes[0]}
        onSelect={(index, value) => setValue(value)}
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
        selected={
          <View style={styles.button}>
            <Image
              source={{ uri: value.icon }}
              style={styles.iconStyle}
            />
            <Text style={styles.buttonText} numberOfLines={1}>
              {value.code}
            </Text>
            <Icon
              name="md-caret-down"
              style={styles.pickerIcon}
            />
          </View>
        }
      />
    )
}

var styles = StyleSheet.create({
    button: {
      justifyContent: 'space-evenly',
      alignItems: 'center',
      flexDirection: 'row',
      height: 50
    },
    buttonText: {
      fontSize: 16,
      color: 'white'
    },
    pickerIcon: {
      color: 'grey',
      width: 23,
      height: 28
    },
    iconStyle: {
      width: 30,
      height: 30
    },
});
```

## Props

Prop                  | Type      | Required | Default                   | Description
--------------------- | --------- | -------- | ------------------------- | -----------
options               | Array     | Yes      |                           | Array of objects to select
selected              | component | Yes      |                           | The selected component
renderRow             | component | Yes      |                           | The component to show in the dropdown
disabled              | bool      | No       | false                     | Disables interaction with the component
scrollEnabled         | bool      | No       | true                      | Scrollable
showItemSeparator     | bool      | No       | false                     | Show item separator between dropdown item
defaultValue          | object    | No       | options[0]                | Default selected value
animated              | bool      | No       | true                      | Animation of showing the dropdown list
showsVerticalScrollIndicator    | bool | No      | false                          | Show vertical scroll indicator of the list
style                 | [style](http://facebook.github.io/react-native/docs/view.html#style)     | No      |                           | The style applied to the option container
dropdownStyle         | [style](http://facebook.github.io/react-native/docs/view.html#style) | No      |                           | The style of the dropdown
dropdownTextStyle     | [style](https://reactnative.dev/docs/text-style-props) | No      |                           | The style of the drop down text

---

**MIT Licensed**