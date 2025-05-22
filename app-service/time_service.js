import { parseQuery } from "../libs/utils";
import { log } from "@zos/utils";
import * as notificationMgr from "@zos/notification";
import * as appServiceMgr from "@zos/app-service";
import { Time, Step } from "@zos/sensor";

const moduleName = "Time Service";

// 타임 센서 생성
const timeSensor = new Time();

// // 걸음 수 센서 생성
// const step = new Step();
// step.onChange();

// // 누적 걸음 수 저장 변수
// let cumulativeSteps = 0;
// let lastStepCount = 0;

const logger = log.getLogger("time.service");

// Send a notification
function sendNotification() {
  logger.log("send notification");
  notificationMgr.notify({
    title: "Time Service",
    content: `Now the time is ${timeSensor.getHours()}:${timeSensor.getMinutes()}:${timeSensor.getSeconds()}`,
    actions: [
      {
        text: "Home Page",
        file: "pages/index",
      },
      {
        text: "Stop Service",
        file: "app-service/time_service",
        param: "action=exit", //! processed in onEvent()
      },
    ],
  });
}

AppService({
  onEvent(e) {
    logger.log(`service onEvent(${e})`);
    let result = parseQuery(e);
    if (result.action === "exit") {
      appServiceMgr.exit();
    }
  },
  onInit(e) {
    logger.log(`service onInit(${e})`);

    timeSensor.onPerMinute(() => {
      logger.log(
        `${moduleName} time report: ${timeSensor.getHours()}:${timeSensor.getMinutes()}:${timeSensor.getSeconds()}`
      );
      sendNotification();
    });

    timeSensor.onPerDay(() => {
      logger.log(moduleName + " === day change ===");
    });
  },
  onDestroy() {
    logger.log("service on destroy invoke");
  },
});
