
const HEADER = ["Environment Name", "AWS Region", "Tenant↵Account", "Index", "Landscape", "Zabbix↵TenamtName", "AWS Info", "HUE Exit IP",
    "Conv app↵CIDR", "Conv admin↵CIDR", "Conv Remote Client (Shared among landscapes)", "HUE Remote Client (Shared among landscapes)",
    "Index of Core RemoteClient (Shared among landscapes)", "MKS↵利用↵↵NAT↵EIP↵公開", "CONV↵VPC↵拡張", "COMPANY_CODE↵for↵LogCrawler",
    "Password for Provisioning", "対象製品↵ for Provisioning", "注文契約書 確認日 for Provisioning", "接続年月日↵ for Provisioning"];
const values = [
    ["HUE_OPS_Commercial", "株式会社トライアルカンパニー様 / Trial Company ,Inc. ", "ap-northeast-1", "ayf5", "50", "develop", "Trial", "trial-develop", "54.64.182.167", "10.100.40.0/23", "10.200.40.0/24", "", "192.168.106.17", "", "", "", "huecore-1223000-trial", "", "", "", ""],
    ["HUE_OPS_Commercial", "株式会社トライアルカンパニー様 / Trial Company ,Inc. ", "ap-northeast-1", "n26n", "6", "production", "Trial", "trial-production", "52.196.163.243", "10.100.40.0/23↵10.101.52.0/22", "10.200.40.0/24", "10.200.40.17", "192.168.106.17", "17", "済", "", "huecore-1223000-trial", "", "", "", ""],
    ["HUE_OPS_Commercial", "商船三井システムズ株式会社様 / MOL Information Systems, Ltd.", "ap-northeast-1", "ayf5", "32", "production", "Molis", "molis-production", "52.199.42.161", "10.100.8.0/23", "10.200.8.0/24", "", "192.168.107.17", "", "済", "", "huecore-100371-molis", "", "", "", ""],
    ["", "（未契約）三菱UFJトラスト", "", "n26n", "", "Provisioning", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "商船三井システムズ株式会社様 / MOL Information Systems, Ltd.", "ap-northeast-1", "ayf5", "7", "develop", "Molis", "molis-develop", "52.197.204.0", "10.100.8.0/23", "10.200.8.0/24", "10.200.8.17", "192.168.107.17", "", "", "", "huecore-100371-molis", "", "", "", ""],
    ["HUE_OPS_Commercial", "株式会社成城石井様 / SEIJO ISHII CO., LTD.", "ap-northeast-1", "n26n", "74", "staging", "Seijo", "seijou-staging", "13.114.252.109", "-", "10.200.26.0/24", "10.200.26.17", "192.168.104.17", "", "", "", "huecore-1210000-seijoishii", "", "", "", ""],
    ["HUE_OPS_Commercial", "株式会社成城石井様 / SEIJO ISHII CO., LTD.", "ap-northeast-1", "ayf5", "4", "develop", "Seijo", "seijou-develop", "52.196.23.164", "-", "10.200.26.0/24", "10.200.26.17", "192.168.104.17", "", "", "", "huecore-1210000-seijoishii", "", "", "", ""],
    ["HUE_OPS_Commercial", "あいおいニッセイ同和損害保険株式会社様 / Aioi Nissay Dowa Insurance Co., Ltd.", "ap-northeast-1", "n26n", "84", "develop", "Aioi", "aioi-staging", "52.196.216.62", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "株式会社アルバック様 / ULVAC, Inc. ↵", "ap-northeast-1", "uxtm", "49", "production", "Ulvac", "ulvac-production", "54.64.28.149", "10.100.64.0/23↵⇒10.101.36.0/22", "10.200.64.0/24", "10.200.64.17", "", "", "", "", "", "", "", "", ""],
    ["", "丸文株式会社様 / MARUBUN CORPORATION", "ap-northeast-", "m7hn", "88", "staging", "Marubun", "marubun-staging", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "丸文株式会社様 / MARUBUN CORPORATION", "ap-northeast-1", "	↵m7hn", "85", "production", "Marubun", "marubun-production", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "丸文株式会社様 / MARUBUN CORPORATION", "ap-northeast-1", "n26n", "48", "develop", "Marubun", "marubun-develop", "54.92.98.113", "", "10.200.60.0/24", "10.200.60.17", "192.168.148.17", "", "", "", "huecore-1258000-marubun ", "", "", "", ""],
    ["HUE_OPS_Commercial", "あいおいニッセイ同和損害保険株式会社様 / Aioi Nissay Dowa Insurance Co., Ltd.", "ap-northeast-1", "ayf5", "72", "Production", "Aioi", "aioi-production", "13.114.185.113 ", "10.101.120.0/22", "10.200.34.0/24", "10.200.34.17", "", "", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "丸一鋼管株式会社/ Maruichi Kokan COMPANY, LIMITED ↵", "ap-northeast-1", "ayf5", "73", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "Maruichi", "maruichi-develop", "52.192.204.209", "10.101.112.0/22", "10.200.98.0/24", "10.200.98.17", "192.168.173.17", "maruichi", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "株式会社アークス / ARCS COMPANY, LIMITED ↵", "ap-northeast-1", "ayf5", "71", "Production", "arcs", "arcs-production", "13.115.8.195/32", "10.101.20.0/22", "10.200.56.0/24", "", "", "", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "戸田建設株式会社様 / ↵TODA CORPORATION", "ap-northeast-1", "ayf5", "29", "develop", "Toda", "toda-develop", "52.199.128.45", "10.101.104.0/22", "10.200.102.0/24", "", "", "", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "株式会社フジタ / Fujita Co,. Ltd.", "ap-northeast-1", "ayf5", "70", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "Fujita", "fujita-develop", "13.114.188.252/32", "10.101.92.0/22", "10.200.94.0/24", "10.200.94.17", "192.168.170.17", "", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "リクルートスタッフィング / Recruit Staffing Co,. Ltd.", "ap-northeast-1", "n26n", "69", "develop", "Rstaffing", "rstaffing-develop", "13.114.16.45/32", "10.101.88.0/22", "10.200.100.0/24", "", "", "", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "大同生命保険 / DAIDO LIFE INSURANCE COMPANY", "ap-northeast-1", "ayf5", "67", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "daido", "daido-develop", "", "", "10.200.92.0/24", "10.200.92.17", "", "", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "高砂熱学工業株式会社 / Takasago Thermal Engineering Co., Ltd.", "ap-northeast-1", "n26n", "66", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "takasago", "takasago-develop", "52.197.23.134", "10.101.60.0/22", "10.200.88.0/24", "10.200.88.17", "", "takasago", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "株式会社LITALICO様 / LITALICO lnc.", "ap-northeast-1", "ayf5", "61", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "Litalico", "litalico-production", "54.64.80.84", "10.101.18.0/22", "10.200.30.0/24", "10.200.30.17", "192.168.126.17", "litalico", "", "", "huecore-1236000-litalico ", "", "", "", ""],
    ["HUE_OPS_Commercial", "株式会社オカモトホールディングス様 / Okamoto Holdings CO., LTD.↵", "ap-northeast-1", "n26n", "58", "develop", "okamoto", "okamoto-develop", "13.113.9.239", "10.101.40.0/22", "10.200.76.0/24", "10.200.76.17", "192.168.158.17", "okamoto", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "新電元工業様 / ↵Shindengen Electric Manufacturing Co., Ltd.", "ap-northeast-1", "sr5p", "64", "develop", "Shindengen", "shindengen-develop", "52.197.69.168", "10.101.76.0/22", "10.200.84.0/24", "", "", "", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "ITO EN (North America) Inc.↵", "ap-northeast-1", "ayf5", "31", "develop", "odakyu", "odakyu-develop", "", "", "", "", "192.168.131.17", "", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "ITO EN (North America) Inc.↵", "us-east-1", "ayf5", "60", "develop", "ItoenNA", "itoenna-develop", "52.20.203.253", "10.100.78.0/23↵→10.101.84.0/22", "10.200.78.0/24", "10.200.78.17", "192.168.160.17", "itoenNA", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "一蘭様 / ICHIRAN Inc.", "ap-northeast-1", "im3c", "54", "develop", "Ichiran", "ichiran-develop", "52.197.240.180", "10.101.12.0/22", "10.200.72.0/24", "10.200.72.17", "192.168.154.17", "ichiran", "", "済", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "鹿島建設株式会社様 / KAJIMA CORPORATION", "ap-northeast-1", "ayf5", "5", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "Kajima", "kajima-develop", "52.196.212.53", "10.100.38.0/23↵→10.101.0.0/22", "10.200.38.0/24", "10.200.38.17", "192.168.105.17", "", "", "済", "huecore-1201000-kajima", "", "", "", ""],
    ["HUE_OPS_Commercial", "株式会社マイナビ様 / Mynavi Corporation", "ap-northeast-1", "ayf5", "38", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "Mynavi", "mynavi-develop", "13.112.115.143", "", "", "", "192.168.138.17", "", "", "", "huecore-0478000-mycom ", "", "", "", ""],
    ["HUE_OPS_Commercial", "株式会社マイナビ様 / Mynavi Corporation", "ap-northeast-1", "ayf5", "59", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "Mynavi", "mynavi-staging", "54.92.122.199", "", "10.101.44.0/22", "", "", "", "", "", "huecore-0478000-mycom ", "", "", "", ""],
    ["HUE_OPS_Commercial", "朝日放送株式会社様 / SEIJO ISHII CO., LTD.", "ap-northeast-1", "n26n", "43", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "Asahi", "asahi-staging", "54.64.220.181", "10.100.4.0/23 ↵⇒10.101.24.0/22", "10.200.4.0/24", "10.200.4.17", "192.168.103.17", "", "済", "済", "huecore-1214000-asahi", "", "", "", ""],
    ["HUE_OPS_Commercial", "朝日放送株式会社様 / SEIJO ISHII CO., LTD.", "ap-northeast-1", "n26n", "3", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "Asahi", "asahi-develop", "52.197.6.100", "10.100.4.0/23↵⇒10.101.24.0/22", "10.200.4.0/24", "10.200.4.17", "192.168.103.17", "", "済", "済", "huecore-1214000-asahi", "", "", "", ""],
    ["HUE_OPS_Commercial", "株式会社成城石井様 / SEIJO ISHII CO., LTD.", "ap-northeast-1", "n26n", "39", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "Seijo", "seijou-production", "", "", "10.200.26.0/24", "", "192.168.104.17", "", "", "", "huecore-1210000-seijoishii", "", "", "", ""],
    ["", "大同生命保険様 / DAIDO LIFE INSURANCE COMPANY", "", "dr9j", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "東和薬品様 / TOWA PHARMACEUTICAL CO., LTD.", "ap-northeast-1", "n26n", "81", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "Towayakuhin", "towayakuhin-production", "52.198.219.21", "10.101.132.0/22", "10.200.74.0/24", "10.200.74.17", "", "towayakuhin", "", "済", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "東和薬品様 / TOWA PHARMACEUTICAL CO., LTD.", "ap-northeast-1", "tef6", "55", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "Towayakuhin", "towayakuhin-develop", "52.68.142.108", "", "10.200.74.0/24", "10.200.74.17", "192.168.155.17", "towayakuhin", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "ローランド株式会社様 / Roland Corporation", "ap-northeast-1", "ayf5", "53", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "Roland", "roland-develop", "13.113.149.11", "10.100.70.0/23", "10.200.70.0/24", "10.200.70.17", "192.168.153.17", "roland", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "三菱製紙株式会社様 / Mitsubishi Paper Mills Limited ↵", "ap-northeast-1", "ayf5", "77", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "Mpm", "mpm-production", "13.112.182.143", "10.101.112.0/22", "10.200.68.0/24", "10.200.68.17", "192.168.151.17", "MPM", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "三菱製紙株式会社様 / Mitsubishi Paper Mills Limited ↵", "ap-northeast-1", "ayf5", "65", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "Mpm", "mpm-staging", "13.114.63.246", "10.100.68.0/23↵→10.101.112.0/22", "10.200.68.0/24", "10.200.68.17", "192.168.151.17", "MPM", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "三菱製紙株式会社様 / Mitsubishi Paper Mills Limited ↵", "ap-northeast-1", "ayf5", "51", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "Mpm", "mpm-develop", "54.92.20.1", "10.100.68.0/23↵→10.101.112.0/22", "10.200.68.0/24", "10.200.68.17", "", "MPM", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "株式会社アルバック様 / ULVAC, Inc. ↵", "ap-northeast-1", "n26n", "56", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "Ulvac", "ulvac-develop", "54.199.128.30", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "鹿島建設株式会社様 / KAJIMA CORPORATION", "ap-northeast-1", "n26n", "75", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "Kajima", "kajima-staging", "52.199.128.35", "10.101.0.0/22", "", "10.200.38.17", "192.168.105.17", "", "", "", "", "", "", "", ""],
    ["SPG", "三越伊勢丹ホールディングス様向けトライアル環境", "ap-northeast-1", "ayf5", "23", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "Imhds", "imhds-develop", "-", "-", "", "", "", "", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "ウイルテック様 / WILLTEC Co., Ltd.", "ap-northeast-1", "ayf5", "79", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "Willtec", "willtec-develop", "13.114.82.101", "10.101.128.0/22", "10.200.104.0/24", "10.200.104.17", "192.168.179.17", "192.168.179.17", "", "", "", "", "", "", ""],
    ["HUE_OPS_Commercial", "市民生活協同組合ならコープ様 / Shimin Seikatsu Kyoudou Kumiai NARA COOP", "ap-northeast-1", "ayf5", "76", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "Nara", "nara-develop", "13.114.220.132", "10.101.116.0/22", "10.200.90.0/24", "10.200.90.17", "192.168.176.17", "", "", "", "", "", "", "", ""],
    ["", "（未契約）慶應義塾大学", "", "ayf5", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）岡村製作所", "", "ayf5", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）ソフトバンクコマース＆サービス", "", "ayf5", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）エプソン", "", "ayf5", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）アルプス技研", "", "ayf5", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）JVCケンウッド", "", "ayf5", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）Altamed", "", "ayf5", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）富士急行", "", "ayf5", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）富士フイルム株式会社　*Arielユーザー", "", "n26n", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）損保ジャパン日本興亜", "", "n26n", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）新日鉄ソリューションズ", "", "ayf5", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）三井物産America", "", "ayf5", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）医療法人社団　葵会", "", "ayf5", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）株式会社レオパレス21　*C2H?", "", "", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）ミネベアミツミ", "", "n26n", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）株式会社ドン・キホーテ　*C2H?", "", "", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）平河商事", "", "n26n", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）清水建設", "", "ayf5", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）三菱商事America", "", "n26n", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）永谷園ホールディングス", "", "n26n", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）JA新潟県厚生農業協同組合連合会", "", "ayf5", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）シップヘルスケアホールディングス株式会社", "", "ayf5", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "HR Core Payroll Expense Accounts Payable Accounts …ancials & Strategy Asset Enterprise Collaboration", "", ""],
    ["", "（未契約） ↵株式会社ＫＳＫ　*C2H?", "", "", "", "Provisioning", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "鹿島建設（HR追加ライセンス）", "", "ayf5", "", "Provisioning", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）DCMホールディングス　*C2H?", "", "ayf5", "", "Provisioning", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）野村不動産", "", "", "", "Provisioning", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）富士通クライアントコンピューティング", "", "n26n", "", "Provisioning", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（未契約）トヨタホーム", "", "ayf5", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "（契約状況不明）ヤマト運輸USA", "", "ayf5", "", "https://maiw.hue.worksap.com/hue/hue/ess/spreadsheet/main?essId=d3e08860-33ba-11e6-bf86-4ba0a0b974ea", "", "", "", "", "", "", "", "", "", "", "", "", "Accounts Payable ", "", ""],
];

let DATA = [];

values.forEach((val, i) => {
    let record = {};
    HEADER.forEach((key, i) => {
        record[key] = val[i+1];
    });
    DATA.push(record);
});


function loadData(arr) {
    if(arr===undefined || arr.length===0) {
        return { header: HEADER, data: DATA }
    }
    let header = [...arr[0]];
    let data = [];
    for(let r = 1; r < arr.length; ++r){
        let record = {};
        for(let c = 0; c < header.length; ++c){
            record[header[c]] = arr[r][c];
        }
        data.push(record);
    }
    return {header, data}
}

export { loadData };


