export const worldClocks = [
  ["澳大利亚墨尔本", "Australia/Melbourne", "Melbourne, AU"],
  ["中国上海", "Asia/Shanghai", "Shanghai, CN"],
  ["美国长滩", "America/Los_Angeles", "Long Beach, US"],
  ["荷兰鹿特丹", "Europe/Amsterdam", "Rotterdam, NL"],
  ["意大利拉斯佩齐亚", "Europe/Rome", "La Spezia, IT"],
  ["南非德班", "Africa/Johannesburg", "Durban, ZA"],
].map(([city, zone, english]) => ({
  city, zone, english,
  formatter: new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: zone,
  }),
}));
