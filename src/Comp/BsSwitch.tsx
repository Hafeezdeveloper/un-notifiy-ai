import * as React from 'react';
import Switch from '@mui/material/Switch';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

export default function BsSwitch(props: any) {
  let { onChange } = props
  // (e) => console.log(e.target.checked)
  return (
    <div>
      <Switch {...label} defaultChecked onChange={onChange} />
    </div>
  );
}