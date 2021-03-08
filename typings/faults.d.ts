export interface FaultList {
  value: Fault[];
}
type Fault = NoFaults | MajorFaults | MinorFaults

interface NoFaults {
  id: "INDICATOR_NONE_IN_DEVICE";
  name: "No fault in device";
  faults: never[];
  serialNumber: string;
}

interface MajorFaults {
  id: "INDICATOR_MAJOR_IN_DEVICE";
  name: "Major Fault in System";
  faults: MajorFault[];
  serialNumber: string;
}
interface MinorFaults {
  id: "INDICATOR_MINOR_IN_DEVICE";
  name: "Minor Fault in System";
  faults: MinorFault[];
  serialNumber: string;
}

type MajorFault =
  | {
      id: "FAULT_TICARD";
      name: "Unable to communicate with the telephone interface card in slot <card slot>";
    }
  | { id: "FAULT_LEM"; name: "Unable to communicate with the network card" }
  | { id: "FAULT_AVB_CARD"; name: "Unable to communicate with an AVB card" }
  | {
      id: "FAULT_IP_CARD";
      name: "Unable to communicate with an audio input card";
    }
  | {
      id: "FAULT_OP_CARD";
      name: "Unable to communicate with an audio output card";
    }
  | {
      id: "FAULT_VOIP_CARD";
      name: "[Component=VoIP:Slot=<card slot>] Unable to communicate with a VoIP card";
    }
  | { id: "FAULT_AEC_CARD"; name: "Unable to communicate with an AEC card" }
  | { id: "FAULT_ANC_CARD"; name: "Unable to communicate with an ANC card" }
  | {
      id: "FAULT_COBRANET_CARD";
      name: "Unable to communicate with a CobraNet card";
    }
  | { id: "FAULT_DSP_CARD"; name: "One or more DSP cards failed to boot" }
  | {
      id: "FAULT_VOIP_CARD_FW_UPDATE";
      name: "[Component=VoIP:Slot=<card slot>] Unable to update VoIP firmware";
    }
  | {
      id: "FAULT_VOIP_CARD_ADDRESS_CONFLICT";
      name: "[Component=VoIP:Slot=<card slot>] IP Address Conflict";
    }
  | {
      id: "FAULT_INVALID_IO_CARD_CONFIG";
      name: "Invalid IO card configuration";
    }
  | {
      id: "FAULT_AVB_STREAM_INACTIVE";
      name: "One or more AVB streams inactive";
    }
  | { id: "FAULT_NETWORK_IP_CHANGED"; name: "Device network parameter changed" }
  | {
      id: "FAULT_SERVER_DEVICE_NOT_FOUND";
      name: "Server device (<hostname>) not found";
    }
  | {
      id: "FAULT_IO_CARD_SLOT";
      name: "Unable to communicate with the IO card in slot <card slot>";
    }
  | {
      id: "FAULT_DSP_CARD_SLOT";
      name: "Unable to communicate with the DSP card in slot <card slot>";
    }
  | {
      id: "FAULT_DSP_APP_SLOT";
      name: "DSP Application error on card in slot <card slot>";
    }
  | {
      id: "FAULT_INVALID_IO_CARD_SLOT";
      name: "Wrong card type installed in slot <card slot>";
    }
  | { id: "FAULT_AVB_DISABLED"; name: "AVB Disabled" }
  | {
      id: "FAULT_DAN1_CARD";
      name: "Unable to communicate with the Dante card in slot <card slot>";
    }
  | {
      id: "FAULT_DAN1_LINKDOWN";
      name: "Dante card in slot <card slot> has all links down";
    }
  | {
      id: "FAULT_DANTE_FLOW_INACTIVE";
      name: "one or more Dante flows inactive";
    }
  | {
      id: "FAULT_USB_CARD";
      name: "Unable to communicate with the USB interface";
    }
  | {
      id: "FAULT_DAN1_CANT_SYNC_TO_BACKPLANE";
      name: "Dante card in slot <card slot> failed to sync clock to backplane";
    }
  | {
      id: "FAULT_LEM_ARM";
      name: "Unable to communicate with backpanel GPIO controller";
    }
  | { id: "FAULT_NO_DSP_CARDS"; name: "No functional DSP cards found" }
  | {
      id: "FAULT_REDUNDANCY_NO_STANDBY";
      name: "Active redundant device not monitored by standby device";
    }
  | {
      id: "FAULT_REDUNDANCY_NO_CABLE_LINK";
      name: "Redundancy cable link not detected";
    }
  | { id: "FAULT_DAN1_MUTED"; name: "DAN1 card audio muted" }
  | {
      id: "FAULT_DEVICE_NEEDS_RECOVERY";
      name: "Device needs recovery from fatal error or firmware update failure";
    }
  | { id: "FAULT_TFPGA_OUT_OF_DATE"; name: "Device requires FPGA update" }
  | {
      id: "FAULT_LABGRUPPEN_FRAME_ERROR";
      name: "Lab.gruppen amplifier has a frame error";
    }
  | {
      id: "FAULT_LABGRUPPEN_CHANNEL_ERROR";
      name: "Lab.gruppen amplifier has a channel error";
    }
  | {
      id: "FAULT_IPOP_CARD";
      name: "Unable to communicate with an audio input/output card";
    }
  | { id: "FAULT_FPGA_POST"; name: "FPGA power on self test failed" }
  | {
      id: "FAULT_EXPANDER_NOT_PRESENT";
      name: "Expander device (<hostname>) not found";
    }
  | {
      id: "FAULT_EXPANDER_FW_UPDATE";
      name: "Expander device (<hostname>) failed firmware update";
    }
  | {
      id: "FAULT_EXPANDER_UNABLE_TO_COMMUNICATE";
      name: "Unable to communicate with expander device (<hostname>)";
    }
  | {
      id: "FAULT_EXPANDER_HW_INCOMPATIBLE";
      name: "Expander device (<hostname>) is incompatible";
    }
  | {
      id: "FAULT_EXPANDER_MAJOR_FAULT_IN_DEVICE";
      name: "Expander device (<hostname>) has major fault";
    }
  | {
      id: "FAULT_VIDEO_INPUT_CARD";
      name: "Unable to communicate with input video card";
    }
  | {
      id: "FAULT_VIDEO_OUTPUT_CARD";
      name: "Unable to communicate with output video card";
    }
  | { id: "FAULT_AMP_CARD"; name: "Unable to communicate with amplifier card" }
  | { id: "FAULT_AMP_TEMP_PSU"; name: "Amp PSU too hot" }
  | { id: "FAULT_AMP_TEMP_CHANNEL"; name: "Amp channel <channel> too hot" }
  | { id: "FAULT_AMP_TEMP_DEVICE"; name: "Amp device too hot" }
  | {
      id: "FAULT_AMP_POWER_CHANNEL";
      name: "Amp channel <channel> too much power";
    }
  | { id: "FAULT_AMP_POWER_DEVICE"; name: "Amp device too much power" }
  | {
      id: "FAULT_AMP_DC_PROTECT";
      name: "Amp detected DC voltage on channel <channel>";
    }
  | {
      id: "FAULT_AMP_SHORT_CIRCUIT";
      name: "Amp detected short circuit on channel <channel>";
    }
  | { id: "FAULT_AMP_CHANNEL"; name: "Amp channel <channel> is faulted" }
  | {
      id: "FAULT_SWITCHABLE_AVB_STREAM_INACTIVE";
      name: "Switchable AVB stream <stream info> inactive";
    }
  | {
      id: "FAULT_SPORT_SWITCH_PLL_LOCK";
      name: "Unrecoverable sync error on clock master media network";
    }
  | {
      id: "FAULT_SPORT_SWITCH_TX_FIFO_UNDERFLOW";
      name: "Card in slot <card slot> encountered media buffer underflow";
    }
  | {
      id: "FAULT_SPORT_SWITCH_TX_FIFO_OVERFLOW";
      name: "Card in slot <card slot> encountered media buffer overflow";
    }
  | {
      id: "FAULT_DAN1_DEVICE_NOT_CONNECTED";
      name: "Dante Block <block name> has unconnected channel(s)";
    }
  | {
      id: "FAULT_DAN1_DEVICE_NOT_FOUND";
      name: "Inactive Dante flow for device <block name>";
    }
  | {
      id: "FAULT_VOIP_CARD_8021x_FAILURE";
      name: "[Component=VoIP:Slot=<card slot>] 802.1X authentication failure";
    }
  | {
      id: "FAULT_CTLPORT_8021x_FAILURE";
      name: "Control port 802.1X authentication failure";
    }
  | {
      id: "FAULT_BFMIC_1_NOT_PRESENT";
      name: "Missing/unplugged microphone pendant 1";
    }
  | {
      id: "FAULT_BFMIC_2__NOT_PRESENT";
      name: "Missing/unplugged microphone pendant 2";
    }
  | {
      id: "FAULT_BFMIC_3_NOT_PRESENT";
      name: "Missing/unplugged microphone pendant 3";
    }
  | {
      id: "FAULT_BFMIC_PLENUM_1_NOT_PRESENT";
      name: "Missing/unplugged TCM-1EX 1";
    }
  | {
      id: "FAULT_BFMIC_PLENUM_2_NOT_PRESENT";
      name: "Missing/unplugged TCM-1EX 2";
    }
  | {
      id: "FAULT_BFMIC_1_UNSUPPORTED";
      name: "Unsupported microphone connected 1";
    }
  | {
      id: "FAULT_BFMIC_2_UNSUPPORTED";
      name: "Unsupported microphone connected 2";
    }
  | {
      id: "FAULT_BFMIC_3_UNSUPPORTED";
      name: "Unsupported microphone connected 3";
    }
  | { id: "FAULT_AMP_PSU_OVERCURRENT"; name: "Amp power supply overcurrent" }
  | {
      id: "FAULT_AMP_1_DEVICE_SHORT_CIRCUIT";
      name: "Amp 1 detected short circuit";
    }
  | {
      id: "FAULT_AMP_2_DEVICE_SHORT_CIRCUIT";
      name: "Amp 2 detected short circuit";
    }
  | { id: "FAULT_AMP_1_DC_VOLTAGE"; name: "Amp 1 detected DC voltage" }
  | { id: "FAULT_AMP_2_DC_VOLTAGE"; name: "Amp 2 detected DC voltage" }
  | { id: "FAULT_AMP_INTERNAL_FAULT"; name: "Amp internal fault" }
  | {
      id: "FAULT_INSUFFICIENT_POE_PLUS_POWER";
      name: "Insufficient power available via PoE+";
    }
  | { id: "FAULT_AMP_1_OVER_TEMP_FAULT"; name: "Amp 1 device too hot" }
  | { id: "FAULT_AMP_2_OVER_TEMP_FAULT"; name: "Amp 2 device too hot" }
  | { id: "FAULT_AMP_1_INTERNAL_FAULT"; name: "Amp 1 internal fault" }
  | { id: "FAULT_AMP_2_INTERNAL_FAULT"; name: "Amp 2 internal fault" }
  | {
      id: "FAULT_AMP_1_UNABLE_TO_COMMUNICATE";
      name: "Amp 1 unable to communicate";
    }
  | {
      id: "FAULT_AMP_2_UNABLE_TO_COMMUNICATE";
      name: "Amp 2 unable to communicate";
    }
  | { id: "FAULT_AMBIENT_OVER_TEMP_FAULT"; name: "Ambient temperature fault" }
  | { id: "FAULT_PRODUCT_ID_ERROR"; name: "Product ID Error" }
  | {
      id: "FAULT_INTERNAL_SENSOR_TEMPERATURE_ERROR";
      name: "Internal Sensor (Temperature) Error";
    }
  | {
      id: "FAULT_INTERNAL_SENSOR_VOLTAGE_ERROR";
      name: "Internal Sensor (Voltage) Error";
    }
  | {
      id: "FAULT_INTERNAL_MESSAGE_BUFFER_UNDERFLOW";
      name: "Internal message buffer underflow";
    }
  | {
      id: "FAULT_INTERNAL_MESSAGE_BUFFER_OVERFLOW";
      name: "Internal message buffer overflow";
    }
  | { id: "FAULT_INTERNAL_MESSAGE_DROPPED"; name: "Internal message dropped" }
  | {
      id: "FAULT_ETHERNET_PORT_NOT_ASCAPABLE";
      name: "AVB port is not 802.1AS capable";
    }
  | {
      id: "FAULT_BLUETOOTH_FW_UPDATE";
      name: "Bluetooth module failed firmware update";
    }
  | {
      id: "FAULT_BLUETOOTH_UNABLE_TO_COMMUNICATE";
      name: "Unable to communicate with Bluetooth module";
    }
  | {
      id: "FAULT_AVB_PORT_8021X_FAILURE";
      name: "AVB port 802.1X authentication failure [in slot <card slot>]";
    }
  | {
      id: "FAULT_CONTROL_TUNNEL_FAILURE_1";
      name: "Control Tunnel Error (SERIAL1): <message>";
    }
  | {
      id: "FAULT_CONTROL_TUNNEL_FAILURE_2";
      name: "Control Tunnel Error (SERIAL2): <message>";
    }
  | {
      id: "FAULT_CONTROL_TUNNEL_INVALID_USAGE_1";
      name: "Control Tunnel Error (SERIAL1): invalid port usage";
    }
  | {
      id: "FAULT_CONTROL_TUNNEL_INVALID_USAGE_2";
      name: "Control Tunnel Error (SERIAL2): invalid port usage";
    }
  | {
      id: "FAULT_VOIP_CARD_CERT_FAILURE";
      name: "[Component=VoIP:Slot=<card slot>] Certificate failure";
    }
  | {
      id: "FAULT_VOIP_CARD_LINE_1_REG_FAILURE";
      name: "[Component=VoIP:Slot=<card slot>:User=<user name>:Line=1:CallAppearance=*] Unregistered (<message>)";
    }
  | {
      id: "FAULT_VOIP_CARD_LINE_2_REG_FAILURE";
      name: "[Component=VoIP:Slot=<card slot>:User=<user name>:Line=2:CallAppearance=*] Unregistered (<message>)";
    }
  | {
      id: "FAULT_INVALID_DAISY_CHAIN_CONFIG";
      name: "Device network connections not connected correctly for daisy chain mode";
    }
  | {
      id: "FAULT_AMP_OPEN_CIRCUIT";
      name: "Amp detected open circuit on channel <channel>";
    }
  | {
      id: "FAULT_BFMIC_CAPSULE_NOT_WORKING";
      name: "Capsule microphone (Mic. <number>, Capsule <number>) not working";
    }
  | {
      id: "FAULT_DANTE_PERMISSIONS";
      name: "DDM permissions are preventing configuration of this Dante device.";
    }
  | {
      id: "FAULT_DANTE_REBOOT_REQUIRED";
      name: "Tesira reboot is required to complete Dante configuration.";
    }
  | { id: "FAULT_OVER_TEMP_FAULT"; name: "Over temperature fault" }
  | { id: "FAULT_AVB_BANDWIDTH_EXCEEDED"; name: "AVB Bandwidth exceeded" }
  | {
      id: "FAULT_POE_OVERCURRENT";
      name: "PoE+ fault on port <number>, Over current limit";
    }
  | {
      id: "FAULT_COMMANDSTRING_RECEIVE_OVERFLOW";
      name: "CommandString receive overflow";
    };

type MinorFault =
  | {
      id: "FAULT_FRONT_PANEL_DISPLAY";
      name: "Unable to communicate with front panel display";
    }
  | {
      id: "FAULT_AUDIO_CLOCKS_NOT_SYNCHRONIZED";
      name: "Audio clocks not synchronized on AVB network";
    }
  | {
      id: "FAULT_INCOMPATIBLE_COMMANDSTRING_SERIAL_PORT";
      name: "CommandString incompatible with serial port 'usage'";
    }
  | {
      id: "FAULT_FAN_MALFUNCTION";
      name: "Cooling fan malfunction.  Check filter and fan.";
    }
  | {
      id: "FAULT_DAN1_NOT_NETWORK_CLOCKMASTER";
      name: "DAN1 card isn't Dante network clock master";
    }
  | {
      id: "FAULT_EXPANDER_UNABLE_TO_FIND_PROXY";
      name: "Unable to find proxy device";
    }
  | {
      id: "FAULT_LABGRUPPEN_FRAME_WARNING";
      name: "Lab.gruppen amplifier has a frame warning";
    }
  | {
      id: "FAULT_LABGRUPPEN_CHANNEL_WARNING";
      name: "Lab.gruppen amplifier has a channel warning";
    }
  | {
      id: "FAULT_EXPANDER_FW_UPDATE_IN_PROGRESS";
      name: "Expander device (<hostname>) firmware update in progress";
    }
  | {
      id: "FAULT_DAN1_DANTE_MIC_FANOUT";
      name: "Dante Mic fanout detected. Remove fanout using Dante Controller.";
    }
  | {
      id: "FAULT_DAN1_DANTE_MIC_INVALID_DEVICE";
      name: "Unsupported device routed to Dante Mic channel. Route an appropriate device using Dante Controller.";
    }
  | {
      id: "FAULT_NETWORK_INTERFACE_INHIBITED";
      name: "Network interface <interface name> disabled due to invalid configuration.  Network address conflicts with other interface(s).";
    }
  | {
      id: "FAULT_AUDIO_CLOCKS_NOT_SYNCHRONIZED_BY_NAME";
      name: "Audio clocks not synchronized on network <network name>";
    }
  | {
      id: "FAULT_EXPANDER_MINOR_FAULT_IN_DEVICE";
      name: "Expander device (<hostname>) has minor fault";
    }
  | {
      id: "FAULT_DYNAMIC_DELAY_EXCEEDED";
      name: "Insufficient dynamic delay; lips may not be synced";
    }
  | {
      id: "FAULT_SPORT_SWITCH_FCLK_SYNC";
      name: "Card in slot <card slot> lost synchronization with internal Tesira media clock";
    }
  | {
      id: "FAULT_DAN1_CHAN_DIFF_CONTROL";
      name: "Unsupported Dante configuration - multiple devices connected to block <block name>";
    }
  | {
      id: "FAULT_BFMIC_1_DETECTED_UNEXPECTEDLY";
      name: "Additional microphone connected 1";
    }
  | {
      id: "FAULT_BFMIC_2_DETECTED_UNEXPECTEDLY";
      name: "Additional microphone connected 2";
    }
  | {
      id: "FAULT_BFMIC_3_DETECTED_UNEXPECTEDLY";
      name: "Additional microphone connected 3";
    }
  | {
      id: "FAULT_AMP_1_OVER_TEMP_WARNING";
      name: "Amp 1 over-temperature warning";
    }
  | {
      id: "FAULT_AMP_2_OVER_TEMP_WARNING";
      name: "Amp 2 over-temperature warning";
    }
  | {
      id: "FAULT_AMBIENT_OVER_TEMP_WARNING";
      name: "Ambient temperature warning";
    }
  | {
      id: "FAULT_BLUETOOTH_FW_UPDATE_IN_PROGRESS";
      name: "Bluetooth module firmware update in progress";
    }
  | { id: "FAULT_OVER_TEMP_WARNING"; name: "Over temperature warning" }
  | {
      id: "FAULT_INFRASTRUCTURE";
      name: "Infrastructure device (<hostname>) fault detected";
    }
  | { id: "FAULT_CPU_OVERLOAD_WARNING"; name: "High CPU utilization detected" }
  | {
      id: "FAULT_AVB_PORT_SPEED_INADEQUATE";
      name: "AVB port link speed less than 1Gbps";
    }
  | {
      id: "FAULT_AMP_LOW_IMPEDANCE";
      name: "Amp detected low impedance on channel <channel>";
    };
