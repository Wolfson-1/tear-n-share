import React from 'react'

export default function AccountSettingsModal({setSettings}) {
  return (
    <div className='modal-background'>
        <div className='modal-form-container'>
            <button onClick={() => {
            setSettings(false)
            }} className='close-modal'>x</button>
            <div className='settings-container'>
                <h2>Profile Settings</h2>
                <table>
                    <tr>
                        <th>User Name</th>
                        <td>Example user name</td>
                    </tr>
                    <tr>
                        <th>Password</th>
                        <td>Example password</td>
                    </tr>
                    <tr>
                        <th>Distance Units</th>
                        <td>
                        <label class="slider-toggle">
                            <input type="checkbox" />
                            <div class="labels">
                                <span class="label-on">KM</span>
                                <span class="label-off">M</span>
                            </div>
                            <div class="slider-icon"></div>
                        </label>
                        </td>
                    </tr>
                </table>
                <button>Deactivate Account</button>
            </div>
        </div>
    </div>
  )
}
