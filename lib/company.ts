export const company = {
  name: "TengYoda Logistics",
  contact: "Vinson",
  email: "vinson_xie@tydscc.cn",
  alternateEmail: "xieguining04@gmail.com",
  phone: "+86 186 2024 4613",
  telephone: "tel:+8618620244613",
  whatsapp: "https://wa.me/8618620244613",
  tiktok: "https://www.tiktok.com/@vinson300",
  instagram: "https://www.instagram.com/vinson08251/",
};

export const companyLocations = [
  { id: "qingdao-warehouse", type: "warehouse", name: { en: "Qingdao Warehouse", "zh-CN": "青岛仓库" }, address: "76 Huanghe East Road, Huangdao District, Qingdao, Shandong, China", chineseAddress: "中国山东省青岛市黄岛区黄河东路76号" },
  { id: "yiwu-warehouse", type: "warehouse", name: { en: "Yiwu Warehouse", "zh-CN": "义乌仓库" }, address: "458 Jingfa Avenue, Beiyuan Subdistrict, Yiwu, Zhejiang, China", chineseAddress: "中国浙江省义乌市北苑街道经发大道458号" },
  { id: "shenzhen-warehouse", type: "warehouse", name: { en: "Shenzhen Warehouse", "zh-CN": "深圳仓库" }, address: "85-8 Nanyuan, Huaide South Road, Fuyong, Bao’an District, Shenzhen, Guangdong, China", chineseAddress: "中国广东省深圳市宝安区福永怀德南路南园85-8号" },
  { id: "foshan-office", type: "office", name: { en: "Foshan Office", "zh-CN": "佛山办公室" }, address: "Room 1011, Building 6, Runhe Jujin Science & Innovation Park, 51 Jianghai Road, Zhangcha Subdistrict, Chancheng District, Foshan, Guangdong, China", chineseAddress: null },
  { id: "shenzhen-office", type: "office", name: { en: "Shenzhen Office", "zh-CN": "深圳办公室" }, address: "JialianDa International, No. 54 Rentian Industrial Zone, Fuhai Subdistrict, Bao’an District, Shenzhen, Guangdong, China", chineseAddress: null },
] as const;

// Opens a prepared message in the visitor's own app; nothing is sent automatically.
export function enquiryLinks(topic = "China sourcing and freight") {
  const message = `Hello Vinson, I would like to enquire about ${topic}.\n\nCargo / product:\nQuantity and packages:\nPacked dimensions and gross weight:\nPickup city:\nDestination and postcode:\nCargo-ready date:\nRequired service / delivery scope:`;
  return {
    whatsapp: `${company.whatsapp}?text=${encodeURIComponent(message)}`,
    email: `mailto:${company.email}?subject=${encodeURIComponent(`TengYoda enquiry — ${topic}`)}&body=${encodeURIComponent(message)}`,
  };
}
