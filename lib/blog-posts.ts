export type BlogLanguage = "en" | "zh-CN";
export type BlogSection = { id: string; heading: string; paragraphs: string[]; bullets?: string[] };
export type BlogContent = { category: string; title: string; summary: string; introduction: string; sections: BlogSection[] };
export type BlogPost = { slug: string; publishedAt: string; author: string; image: { src: string; alt: Record<BlogLanguage, string> }; content: Record<BlogLanguage, BlogContent> };

// Add a post here to update the blog directory, homepage and article routes together.
export const blogPosts: BlogPost[] = [
  {
    slug: "buying-from-china-checklist", publishedAt: "2026-08-30", author: "TengYoda Logistics",
    image: { src: "/images/procurement-warehouse.webp", alt: { en: "Checking supplier orders and packing in a China export warehouse", "zh-CN": "在中国出口仓库核对供应商订单与包装" } },
    content: {
      en: {
        category: "IMPORT GUIDE",
        title: "Buying from China: a checklist for first-time importers",
        summary: "Supplier terms, product compliance, packing, payment milestones and shipment planning.",
        introduction: "If you are buying from China for the first time, the purchase price is only one part of the import plan. A usable logistics plan starts before the supplier finishes production. Confirming the product, responsibilities and delivery details early gives your supplier, warehouse and freight forwarder the same instructions to work from.",
        sections: [
          { id: "supplier", heading: "1. Confirm the supplier and order scope", paragraphs: ["Check the legal business name, the person handling your order and the beneficiary details shown on the commercial documents. Independently verify unexpected changes to payment instructions through a previously confirmed contact channel.", "Record the agreed model, materials, quantity, finish and included accessories in writing. Samples and inspection requirements should be agreed before production, rather than becoming a discussion when the goods are already packed."] },
          { id: "requirements", heading: "2. Review destination requirements before production", paragraphs: ["Describe what the product is, what it is made from and how it will be used. Share that information with your destination customs broker or relevant specialist before committing to specifications or packaging.", "Do not assume that a product accepted for sale in China is automatically ready for your destination market. The applicable product standards, documents and import conditions need to be checked for your particular goods and destination."] },
          { id: "packing", heading: "3. Ask for packed dimensions, not just product dimensions", paragraphs: ["Freight planning uses the shipment as it will actually travel. Ask for the number of cartons, pallets or crates, external dimensions of each package and gross weight. Include photos and note whether packages can be stacked.", "Tell the supplier if cargo will pass through a consolidation warehouse. Agree on labels and an order reference so incoming goods can be matched to the correct buyer."], bullets: ["Cargo description and order reference", "Package count, dimensions and gross weight", "Stackability and handling restrictions", "Photos of goods and proposed packaging"] },
          { id: "handoffs", heading: "4. Agree on timing and handoffs", paragraphs: ["Distinguish the production completion date from the date goods are ready for collection. Packing, inspection and paperwork may still need to be completed. Identify who books domestic transport and who pays for loading and warehouse delivery.", "When several suppliers are involved, ask each for a realistic ready date. Decide whether to wait for all orders or split the shipment; either choice can affect storage, handling and transport costs."] },
          { id: "quote", heading: "5. Review the complete quotation scope", paragraphs: ["Request a written breakdown identifying included services and exclusions. Origin pickup, warehouse handling, international freight, destination charges and final delivery are different stages; a low freight-only rate does not describe the total journey.", "Before confirming a booking, reconcile the quotation against the final packing list, pickup address and delivery conditions. Send TengYoda your supplier city, product details and destination to start an origin-side review."] },
        ],
      },
      "zh-CN": {
        category: "进口指南", title: "首次从中国采购：海外进口商准备清单",
        summary: "供应商条款、产品合规、包装、付款节点与运输规划。",
        introduction: "产品采购价只是进口订单的一部分。可执行的物流计划应在供应商完成生产前开始准备。提前确认产品、责任划分与交货信息，能让供应商、仓库和货代按照同一份要求推进工作。",
        sections: [
          { id: "supplier", heading: "一、确认供应商与订单范围", paragraphs: ["核实企业名称、订单对接人，以及商业文件上的收款信息。如果付款指示突然发生变化，应通过此前已确认的联系渠道独立核实。", "将型号、材质、数量、颜色和配件范围落实到书面文件。样品要求与验货安排应在生产前确认，而不是等到货物包装完成后再讨论。"] },
          { id: "requirements", heading: "二、生产前核对目的地要求", paragraphs: ["明确产品名称、材质和用途。在确定产品规格与包装前，将这些信息交给目的地清关行或相关专业人员核实。", "不能假设可在中国销售的商品一定可以直接进入目的地市场。产品标准、所需文件和进口条件需要结合具体货物与国家确认。"] },
          { id: "packing", heading: "三、索取包装后尺寸，而不只是产品尺寸", paragraphs: ["物流方案应以实际交运状态为依据。请供应商提供箱、托盘或木箱的数量、各件外包装尺寸及毛重，并附照片，说明能否叠放。", "如果货物需要进入集运仓，应提前约定唛头与订单编号，方便仓库把到货信息匹配到正确客户。"], bullets: ["货物品名与订单编号", "包装件数、外尺寸和毛重", "能否叠放及装卸限制", "货物与拟采用包装的照片"] },
          { id: "handoffs", heading: "四、明确交期和各环节交接", paragraphs: ["生产完成日期不等于可提货日期；包装、验货和单证可能仍未完成。还应明确由谁安排国内运输，以及装车和送仓费用由谁承担。", "涉及多家供应商时，分别确认实际可交货时间。选择等待全部货齐或分批发运，会影响仓储、操作及运输成本。"] },
          { id: "quote", heading: "五、确认完整报价范围", paragraphs: ["要求提供书面费用明细，列清包含项目与不包含项目。起运地提货、仓库操作、国际运输、目的港费用与末端派送是不同环节，单独一项低运价不代表全程成本。", "确认订舱前，根据最终装箱单、提货地址及送货条件再次核对报价。您可以向 TengYoda 提供供应商城市、产品信息与目的地，开始中国端运输评估。"] },
        ],
      },
    },
  },
  {
    slug: "express-air-lcl-fcl-guide", publishedAt: "2026-08-30", author: "TengYoda Logistics",
    image: { src: "/images/air-freight.webp", alt: { en: "Palletised cargo being loaded into a freight aircraft", "zh-CN": "托盘货物正在装入货机" } },
    content: {
      en: {
        category: "FREIGHT PLANNING", title: "Shipping from China: express, air freight, LCL or FCL?",
        summary: "Compare urgency, volume, cargo value and destination cost before making a booking.",
        introduction: "Choosing a shipping method from China means comparing express, air freight, LCL and FCL against the actual order. There is no universal shipment-size threshold for every importer. Compare complete quotations for the same cargo and delivery scope, then assess timing, handling, acceptance and the cost of waiting for the goods.",
        sections: [
          { id: "express", heading: "1. Express for smaller, urgent consignments", paragraphs: ["International express can suit samples, documents and smaller orders. Before selecting a service, confirm the cargo type, packed dimensions, destination postcode and whether the shipment has batteries, liquids or other special characteristics.", "A parcel rate needs to be checked against the applicable chargeable weight and any handling or delivery surcharges. Ask what the quote includes at destination rather than assuming the courier price covers every import cost."] },
          { id: "air", heading: "2. Air freight for time-sensitive cargo", paragraphs: ["Air freight can be considered when the shipment is urgent or the commercial cost of a delay is high. Compare an airport-only quotation with the cost of the remaining clearance, handling and delivery stages.", "Flight routing is only part of the schedule. Cargo readiness, export preparation, available capacity and destination release also affect when the goods can actually reach the buyer."] },
          { id: "lcl", heading: "3. LCL when you do not need a whole container", paragraphs: ["Less-than-container-load shipping combines multiple consignments in one container. It can suit orders that do not justify booking a dedicated container, but consolidation and unpacking add handling stages.", "Check origin warehouse charges and destination deconsolidation fees, alongside the ocean rate. Packaging needs to suit those additional handoffs. Compare the full delivered scope with alternatives rather than using a universal cubic-metre threshold."] },
          { id: "fcl", heading: "4. FCL for a dedicated container plan", paragraphs: ["Full-container-load booking provides a dedicated container for the booked shipment; it does not require filling every available space. Cargo dimensions, weight distribution and loading access all matter when choosing equipment.", "Ask about loading arrangements at origin and unloading arrangements at destination. Confirm whether the receiver can handle the container and what appointments, equipment or onward transport may be needed."] },
          { id: "compare", heading: "5. Compare one cargo profile across all options", paragraphs: ["Give your forwarder the same final packing list, origin, destination and required arrival date for each comparison. State which date is a business deadline and which is only a preference.", "Sometimes a split plan works best: send a small urgent batch separately while the balance travels by sea. Assess the extra shipment and handling costs before choosing that approach."], bullets: ["Use identical cargo and delivery information", "Compare included charges and exclusions", "Review cargo acceptance and packing requirements", "Allow for the whole journey, not just the main transport leg"] },
        ],
      },
      "zh-CN": {
        category: "运输规划", title: "从中国发货：如何选择快递、空运、拼箱与整柜？",
        summary: "订舱前综合比较时效、货量、货值及目的地费用。",
        introduction: "不存在适用于所有进口商的固定货量分界线。应针对同一批货物、相同交付范围比较完整报价，再综合考虑时效、装卸环节、承运条件及等待货物的商业成本。",
        sections: [
          { id: "express", heading: "一、快递：适合较小且较急的货件", paragraphs: ["国际快递可以用于样品、文件和较小订单。选择服务前应确认品名、包装尺寸、目的地邮编，以及是否含电池、液体或其他特殊成分。", "快递报价应核对适用计费重与操作、派送附加费用。不能直接假设快递运费已经包含目的地的全部进口费用。"] },
          { id: "air", heading: "二、空运：服务有时效要求的货物", paragraphs: ["货物比较紧急，或延误会带来较高商业损失时，可以评估空运。机场到机场的报价，还应加上剩余清关、操作及末端派送环节进行比较。", "航班时间只是运输计划的一部分。货物准备、出口手续、舱位和目的地放行都会影响客户实际收到货物的时间。"] },
          { id: "lcl", heading: "三、拼箱：不需要独立整柜时的选项", paragraphs: ["海运拼箱将多票货物组合在同一集装箱中，适合不需要单独订柜的订单，但集货与拆箱会增加装卸环节。", "除海运费外，还应核对起运仓费用及目的地拆箱等费用。包装也应适应多次交接。请按完整交付成本比较，不要只套用固定立方数分界线。"] },
          { id: "fcl", heading: "四、整柜：为货物安排专用集装箱", paragraphs: ["整柜订舱为该票货物安排专用集装箱，不要求必须装满每一处空间。选择柜型时，应综合考虑货物尺寸、重量分布与装柜条件。", "核实起运地装柜和目的地卸货安排。确认收货人能否接收集装箱，以及是否需要预约、卸货设备或进一步转运。"] },
          { id: "compare", heading: "五、用同一份货物资料比较方案", paragraphs: ["向货代提供相同的最终装箱单、起运地、目的地和希望到货日期。说明哪些日期属于必须达到的业务节点，哪些只是偏好。", "有时可以将少量急货单独发运，其余货物走海运。在选择这种组合方案前，也要评估新增票数与操作费用。"], bullets: ["比较时使用一致的货物和交付信息", "核对包含费用与不包含费用", "确认承运条件及包装要求", "按全程时间评估，而不只看主运输段"] },
        ],
      },
    },
  },
  {
    slug: "avoid-destination-shipping-charges", publishedAt: "2026-08-30", author: "TengYoda Logistics",
    image: { src: "/images/sea-freight.webp", alt: { en: "Container vessel and terminal handling at a destination port", "zh-CN": "目的港集装箱船与码头操作场景" } },
    content: {
      en: {
        category: "RISK CONTROL", title: "Destination shipping charges: five checks before arrival",
        summary: "Accurate documents, suitable packing and early booking protect the shipment plan.",
        introduction: "Destination shipping charges need to be reviewed alongside the international freight quote. Not every destination charge is avoidable, and a good plan cannot rule out inspections or disruption. But incomplete instructions and missed handoffs can add cost unnecessarily. These five checks help an importer prepare before the cargo arrives.",
        sections: [
          { id: "scope", heading: "1. Separate included charges from exclusions", paragraphs: ["Ask for a destination cost breakdown in writing. Identify which party arranges clearance, handles terminal or warehouse charges and books final delivery. Make sure every quote is based on the same delivery scope.", "Ask how exceptional work is approved and billed. Inspections, additional handling or other unplanned services should not be confused with charges already included in the quotation."] },
          { id: "documents", heading: "2. Check documents while there is time to correct them", paragraphs: ["Share the commercial invoice, packing list and shipment details with the appointed destination representative early. Names, addresses, descriptions, quantities and weights should describe the same order consistently.", "Ask which additional documents are required for the specific goods. Correcting discrepancies before arrival can be easier than resolving them while cargo is waiting for release."] },
          { id: "release", heading: "3. Assign responsibility for release and payment", paragraphs: ["Confirm who will receive carrier notices, invoices and release instructions. Agree how those messages will be forwarded and who is authorised to handle each action.", "Cargo availability, carrier release and customs release are separate items to confirm. Ask the local representative which outstanding steps remain before pickup can actually be booked."] },
          { id: "collection", heading: "4. Confirm collection windows and return arrangements", paragraphs: ["Obtain the applicable storage and equipment terms from the carrier, terminal and delivery provider. Confirm when each charging period starts, what time is included and how dates are counted for that shipment.", "Book transport with enough information to coordinate terminal access and the receiver's unloading capacity. For container deliveries, confirm the empty-return plan as well as the loaded delivery plan."] },
          { id: "delivery", heading: "5. Describe the final delivery location accurately", paragraphs: ["Provide the complete address, contact person, opening hours and any access restrictions. Tell the delivery provider whether unloading equipment is available and whether an appointment is needed.", "A residential address, restricted vehicle access or the need for special unloading may change the delivery arrangement. Raise these details before accepting the quote, and keep the forwarder updated if the receiving conditions change."], bullets: ["Receiver contact and delivery appointment", "Vehicle access and site opening hours", "Unloading equipment and staff availability", "Container return or packaging-handling arrangements"] },
        ],
      },
      "zh-CN": {
        category: "风险管理", title: "目的港费用：货物到港前的五项核对",
        summary: "准确单证、合适包装和提前订舱，让运输计划更加稳妥。",
        introduction: "并非所有目的港费用都可以避免，完善计划也无法排除查验或突发延误。但信息不完整、交接不及时可能造成额外成本。以下五项核对工作，有助于进口商在到港前做好准备。",
        sections: [
          { id: "scope", heading: "一、区分报价内费用与除外项目", paragraphs: ["要求提供书面的目的地费用明细。明确由谁安排清关、处理码头或仓库费用、预约末端派送，并确保各份报价基于相同服务范围。", "提前约定额外作业的确认与结算方式。查验、额外装卸及其他非计划项目，应与报价已包含的费用区分清楚。"] },
          { id: "documents", heading: "二、在仍有修改时间时核对单证", paragraphs: ["提前向指定的目的地代理提供商业发票、装箱单及运输信息。收发货人名称、地址、品名、数量与重量应一致地反映同一订单。", "询问具体货物还需哪些文件。通常在到港前修正信息，比货物等待放行时再处理更加从容。"] },
          { id: "release", heading: "三、明确放货和付款的负责人", paragraphs: ["确认谁负责接收船司通知、账单及放货指示，并约定消息如何转发、由谁处理每个环节。", "货物可提、承运人放货和海关放行是需要分别确认的事项。应向当地代理核实实际预约提货前，还有哪些步骤未完成。"] },
          { id: "collection", heading: "四、核对提货窗口及还柜安排", paragraphs: ["向船司、码头及运输服务商索取适用的堆存和箱使条款。确认各项计费从何时开始、包含多少时间，以及该票货物采用何种日期计算方式。", "安排车辆时，应同步协调码头进出条件与收货人的卸货能力。涉及整柜派送时，既要确认重柜送货，也要落实空柜归还计划。"] },
          { id: "delivery", heading: "五、准确描述末端派送条件", paragraphs: ["提供完整地址、联系人、营业时间及车辆通行限制，并说明是否有卸货设备、是否需要预约。", "住宅地址、车辆进入受限或需要特殊卸货设备，都可能影响派送安排。应在确认报价前提出这些信息；收货条件发生变化时也应及时通知货代。"], bullets: ["收货联系人与送货预约", "车辆进入条件和现场营业时间", "卸货设备与人员安排", "还柜或包装处理安排"] },
        ],
      },
    },
  },
];

export function getBlogPost(slug: string) { return blogPosts.find(post => post.slug === slug); }
export function readingMinutes(content: BlogContent, language: BlogLanguage) {
  const text = [content.introduction, ...content.sections.flatMap(section => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])])].join(" ");
  return Math.max(1, Math.ceil(language === "en" ? text.split(/\s+/).length / 200 : text.length / 400));
}
export function formatBlogDate(date: string, language: BlogLanguage) {
  return new Intl.DateTimeFormat(language === "en" ? "en-GB" : "zh-CN", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}
