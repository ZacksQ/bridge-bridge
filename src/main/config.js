/** 环境 */
// export const ACTIVE_PROFILE = "dev";
export const ACTIVE_PROFILE = "prod";
/** 服务器地址 */
// export const API_PREFIX = '/api'
export const API_PREFIX = '/zapi/api'
// export const SERVER_URL = 'http://218.94.57.151:8087' + API_PREFIX
export const SERVER_URL = window.location.origin + API_PREFIX//" http://218.94.57.151:8087";
/** 测试服务器地址 */
// export const TEST_SERVER_URL = "http://192.168.8.163:9001";
export const TEST_SERVER_URL = "http://192.168.26.23:8080";
/** 前端加密钥匙 */
export const CRYPTO_KEY = '1728e404ad694216a3362ed7e2e46480';
/** 系统相关 */
export const SYSTEM_ID = "d5eebd10910948daadd4f45e91ec5477";
/** 系统服务名 */
export const BRIDGE_SERVICE = "";
export const REGULAR_INSPECTION_SERVICE = "regular-szgsinspection";
export const MAINTAIN_MANAGE_SERVICE = "maintain-szgsmanage";
export const BRIDGE_POLICY = "bridge-szgspolicy";
export const BEIDGE_BASE = "bridge-base"; //经常检查 sunzack
export const TIMING_REPORT = "timing-szgsreport";
export const BEIDGE_PARAM = "bridge-param";
export const BEIDGE_FILE = "file-service";
/** 阿里云存储地址 */
export const ALIOSS_URL = 'https://net-jsrbc-bridge.oss-cn-hangzhou.aliyuncs.com/'

export const SYS_NAME = '桥梁智慧系统'