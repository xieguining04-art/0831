import { Building2, Warehouse } from "lucide-react";
import { companyLocations } from "@/lib/company";
import { Reveal } from "@/components/motion";
import type { Language } from "@/lib/localization";

export function CompanyNetwork({ language }: { language: Language }) {
  const zh = language === "zh-CN";
  return <section className="network section" id="network"><div className="wrap">
    <div className="section-head dark-head"><div><span className="kicker light"><i />{zh ? "中国服务网络" : "CHINA NETWORK"}</span><h2>{zh ? "从工厂到港口，衔接中国端每一步。" : "Connected to where your cargo begins."}</h2></div><p>{zh ? "青岛、义乌、深圳三地仓库，佛山与深圳办公室。" : "Warehouses in Qingdao, Yiwu and Shenzhen. Offices in Foshan and Shenzhen."}</p></div>
    <div className="location-grid">{companyLocations.map((location, index) => <Reveal key={location.id} delay={(index % 3) * 60}><article id={location.id} className={`location-card location-${location.type}`}><div className="location-card-top"><span>0{index + 1} / {location.type === "warehouse" ? (zh ? "仓储网点" : "WAREHOUSE") : (zh ? "运营网点" : "OFFICE")}</span>{location.type === "warehouse" ? <Warehouse aria-hidden="true" /> : <Building2 aria-hidden="true" />}</div><h3>{location.name[language]}</h3><address>{zh && location.chineseAddress ? location.chineseAddress : location.address}</address></article></Reveal>)}</div>
    <p className="receiving-note">{zh ? "安排送仓前，请先联系 Vinson 确认收货预约、唛头和订单编号。" : "Before sending cargo, contact Vinson to confirm receiving arrangements, shipping marks and order references."}</p>
  </div></section>;
}
