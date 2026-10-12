const t=[{category:"STM32",subcategory:"内核与架构",type:"qa",question:"Cortex-M3、M4、M7 的主要差异是什么？",answer:`- Cortex-M3：无 FPU、无 DSP 指令，三级流水线，适合通用控制。
  - Cortex-M4：在 M3 基础上增加 **DSP 指令**和**可选单精度 FPU**，适合数字信号处理。
  - Cortex-M7：增加**双发射流水线**、**可选双精度 FPU**、**指令/数据 Cache**、AXI 总线，性能最高，适合复杂运算。
  - 三者都支持 Tail-Chaining、中断硬件压栈，中断响应都很快。`,explanation:"选型时按“是否需要浮点/大量运算”决定；F1 用 M3，F4 用 M4，F7/H7 用 M7。",difficulty:2,tags:["高频","概念辨析"],tier:"must"},{category:"STM32",subcategory:"内核与架构",type:"qa",question:"什么是寄存器映射？为什么写某个地址就能控制外设？",answer:"芯片把每个外设的寄存器固定映射到一段**内存地址**（Memory-Mapped IO）。CPU 把外设寄存器当作普通内存访问，向该地址写值即配置外设，读该地址即读取状态。如 `GPIOA->ODR = 0x01` 实际是向 GPIOA 输出数据寄存器地址写入。",explanation:"映射关系由芯片手册“存储器映像”章节给出，头文件里用结构体指针封装。",difficulty:1,tags:["高频","原理推导"],tier:"must"},{category:"STM32",subcategory:"内核与架构",type:"qa",question:"简述 Cortex-M 的寄存器组（R0~R15、xPSR、PRIMASK 等）。",answer:"通用寄存器 R0~R12；R13 为 SP（栈指针，有 MSP/PSP 两个）；R14 为 LR（链接寄存器，存返回地址）；R15 为 PC。特殊寄存器：xPSR（程序状态，含 APSR/IPSR/EPSR）、PRIMASK（关全局中断）、FAULTMASK、BASEPRI（按优先级屏蔽）、CONTROL（选择栈指针/特权级）。",explanation:"中断/函数调用靠 LR 和自动压栈的 xPSR/PC/LR/R0~R3/R12 实现返回。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"内核与架构",type:"qa",question:"什么是哈佛架构？Cortex-M 是哈佛还是冯·诺依曼？",answer:"哈佛架构指**指令总线与数据总线分离**，可同时取指和访存；冯·诺依曼是统一总线。Cortex-M 是**改进的哈佛架构**（内核内指令/数据分开），但对外是统一编址的地址空间。",explanation:"分离总线带来更高的取指效率，是 MCU 实时性的基础之一。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"内核与架构",type:"qa",question:"Thumb/Thumb-2 指令集是什么？为什么 Cortex-M 只用 Thumb？",answer:"Thumb 是 16 位压缩指令集，代码密度高；Thumb-2 混合 16/32 位，兼顾密度与性能。Cortex-M 只支持 Thumb/Thumb-2（不支持 ARM 32 位指令），以减小代码体积、降低功耗。",explanation:"M 系列定位低功耗小 Flash，代码密度比性能更重要。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"内核与架构",type:"qa",question:"什么是 bit-band（位带）操作？有什么用？",answer:"Cortex-M3/M4 把外设/SRAM 的某一位映射到一个**独立的字地址**，对该字读写即原子地操作该位。\n  ```c\n  #define BITBAND(addr, bit) \\\n    (*((volatile uint32_t *)(0x42000000 + ((uint32_t)(addr)-0x40000000)*32 + (bit)*4)))\n  BITBAND(&GPIOA->ODR, 5) = 1; // 原子置位 PA5\n  ```",explanation:"避免“读-改-写”竞争，常用于并发/ISR 中操作标志位；M0 不支持位带。",difficulty:3,tags:["原理推导"],tier:"familiar"},{category:"STM32",subcategory:"时钟系统",type:"qa",question:"STM32 常见的时钟源有哪些？",answer:"HSI（内部高速 RC，约 8M，免外部但不准）、HSE（外部晶振 4~26M，精度高）、LSI（内部低速 ~32k，给 IWDG）、LSE（外部 32.768k，给 RTC）、PLL（锁相环倍频得到 SYSCLK）。",explanation:"通信/计时优先 HSE；低功耗待机常靠 LSE 维持 RTC。",difficulty:1,tags:["高频","概念辨析"],tier:"must"},{category:"STM32",subcategory:"时钟系统",type:"qa",question:"什么是 PLL？系统时钟 SYSCLK 最大频率多少？",answer:"PLL 锁相环对输入时钟倍频。F1 系列 SYSCLK 最大 72MHz，F4 168MHz，F7/H7 更高（H7 可超 400MHz），具体见数据手册。",explanation:"HSE/HSI 经 PLL 后得到高频 SYSCLK，再分频给 AHB/APB。",difficulty:1,tags:["高频","概念辨析"],tier:"must"},{category:"STM32",subcategory:"时钟系统",type:"qa",question:"AHB、APB1、APB2 总线时钟有什么关系？",answer:"SYSCLK 经 AHB 预分频得到 HCLK（AHB 时钟，常=SYSCLK）；APB1 由 HCLK 再分频（F1 上通常 ≤36MHz），APB2 分频后较高（F1 上 72MHz）。挂在 APB1/APB2 上的定时器时钟会在分频系数为 1 时×1、否则×2。",explanation:"配置外设时钟前要清楚它挂在哪条总线，避免超频。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"时钟系统",type:"qa",question:"为什么操作外设前必须开启其时钟（如 __HAL_RCC_GPIOA_CLK_ENABLE()）？",answer:"STM32 默认关闭未用外设时钟以省功耗；不使能对应总线时钟，写寄存器无效、读回来也是 0。",explanation:"这是“配置完 GPIO 不工作”的最常见原因之一。",difficulty:1,tags:["高频","故障排查"],tier:"must"},{category:"STM32",subcategory:"时钟系统",type:"qa",question:"如何计算定时器/串口的实际时钟？",answer:"从 HSE/HSI 经 PLL 得到 SYSCLK=HCLK，再除以 APB 预分频得到 PCLK，挂在 APB 上的定时器时钟 = PCLK×(分频≠1?2:1)。串口波特率由 PCLK 经 USARTDIV 分频得到。",explanation:"CubeMX 的时钟树图能直观看到每条路径的分频系数。",difficulty:2,tags:["原理推导"],tier:"familiar"},{category:"STM32",subcategory:"时钟系统",type:"qa",question:"HSE 与 HSI 如何选型？时钟安全系统(CSS)是什么？",answer:"HSE 精度高需外部晶振；HSI 免外部但有温漂。时钟安全系统(CSS)在 HSE 失效时自动切换到 HSI 并产生 NMI 中断，提升可靠性。",explanation:"安全/工业场景建议开启 CSS。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"GPIO",type:"qa",question:"GPIO 有哪几种输入/输出模式？",answer:"输入：浮空、上拉、下拉、模拟。输出：推挽、开漏（各有通用/复用两种）。",explanation:"模拟输入用于 ADC；开漏用于 I2C/电平转换。",difficulty:1,tags:["高频","概念辨析"],tier:"must"},{category:"STM32",subcategory:"GPIO",type:"qa",question:"推挽输出和开漏输出的区别？各用在哪？",answer:"推挽可主动输出高、低电平、驱动强，用于 LED/普通驱动；开漏只能拉低、输出高需外部上拉，支持“线与”和电平转换，用于 I2C。",explanation:"多个开漏引脚直接相连不会短路，可实现多设备共享总线。",difficulty:1,tags:["高频","概念辨析"],tier:"must"},{category:"STM32",subcategory:"GPIO",type:"qa",question:"什么是复用功能(AF)和引脚重映射(remap)？",answer:"AF 把引脚分配给片内外设（如 PA9=USART1_TX），需配置为复用模式并选 AF 编号；remap 把外设默认脚映射到另一组物理脚，便于布线/避开冲突（通过 AFIO/SYSCFG）。",explanation:"F1 用 AFIO_MAPR 重映射；F4+ 用 GPIOx_AFR 选择 AF0~AF15。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"GPIO",type:"qa",question:"GPIO 输出速度(2/10/50MHz)是什么意思？它限制翻转频率吗？",answer:"指输出驱动电路的压摆率（边沿陡度），影响 EMI 与功耗；并不严格限制软件翻转的最高频率。",explanation:"高速模式边沿陡、EMI 大；非高速信号用低速更省电。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"GPIO",type:"qa",question:"把 PA0 配置为外部中断输入的步骤？",answer:"① 开 GPIO 时钟与 SYSCFG 时钟；② PA0 设为输入（上拉/下拉）；③ 通过 SYSCFG 把 EXTI0 线映射到 PA0；④ 配置 EXTI 触发边沿并使能；⑤ 配置 NVIC 优先级并使能对应中断；⑥ 在 EXTI0_IRQHandler 里清标志。",explanation:"EXTI 线是“中断源”，NVIC 是“内核调度”，两者都要配。",difficulty:2,tags:["高频","场景设计"],tier:"must"},{category:"STM32",subcategory:"GPIO",type:"qa",question:"如何直接操作寄存器翻转一个 IO（不用 HAL）？",answer:`\`\`\`c
  #define GPIOA_ODR (*(volatile uint32_t *)0x4001080C)
  GPIOA_ODR ^= (1 << 5);          // 翻转 PA5
  // 或利用 BSRR 原子置/复位
  #define GPIOA_BSRR (*(volatile uint32_t *)0x40010810)
  GPIOA_BSRR = (1 << 5);           // 置位 PA5
  GPIOA_BSRR = (1 << (5 + 16));    // 复位 PA5
  \`\`\``,explanation:"BSRR 高 16 位写 1 复位、低 16 位写 1 置位，且为原子操作。",difficulty:3,tags:["代码分析"],tier:"familiar"},{category:"STM32",subcategory:"中断与 NVIC",type:"qa",question:"NVIC 和 EXTI 有什么区别？",answer:"NVIC 是 Cortex-M 内核中断控制器，统一管优先级与响应；EXTI 是 STM32 外部中断/事件控制器，把 GPIO 等外部信号变成中断线送给 NVIC。",explanation:"EXTI 负责“产生中断请求”，NVIC 负责“决定何时执行”。",difficulty:2,tags:["高频","概念辨析"],tier:"must"},{category:"STM32",subcategory:"中断与 NVIC",type:"qa",question:"什么是中断优先级分组？抢占优先级和子优先级有何不同？",answer:"STM32 用若干位表示优先级，可划分为抢占优先级和子优先级（NVIC_PriorityGroupConfig）。抢占优先级决定能否打断正在执行的中断；子优先级只在两中断同时挂起且抢占相同时决定先后。",explanation:"数值越小优先级越高（注意与 FreeRTOS 任务优先级方向相反）。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"中断与 NVIC",type:"qa",question:"什么是中断尾链(Tail-Chaining)和迟来(Late Arrival)？",answer:"尾链：上一个 ISR 结束、下一个同级/高优先级 ISR 开始时，跳过重复的压栈/出栈，直接跳入，降低延迟。迟来：若高优先级中断在低端 ISR 压栈过程中到达，会“插队”先执行高优先级。",explanation:"这两个硬件优化使 Cortex-M 中断切换极快。",difficulty:3,tags:["原理推导"],tier:"familiar"},{category:"STM32",subcategory:"中断与 NVIC",type:"qa",question:"在 ISR 里能随意调用 HAL_Delay 吗？",answer:"不能。HAL_Delay 基于 SysTick 中断计时，在中断上下文调用会死循环或计时不准确。",explanation:"ISR 应尽量短；需要延时就用状态机/标志位交给主循环或任务处理。",difficulty:1,tags:["高频","故障排查"],tier:"must"},{category:"STM32",subcategory:"中断与 NVIC",type:"qa",question:"中断标志不清除会有什么后果？如何清除？",answer:"不清除会导致中断反复进入（一次事件触发多次 ISR）。多数外设读状态或写“清除位”清标志（如 EXTI_ClearITPendingBit、TIM_ClearITPendingBit）。",explanation:"Cube 里 HAL 的 IRQHandler 已帮你清，但手写裸机中断容易漏清。",difficulty:2,tags:["故障排查"],tier:"familiar"},{category:"STM32",subcategory:"中断与 NVIC",type:"qa",question:"进入中断时硬件自动保存了哪些寄存器？返回时如何恢复？",answer:"硬件自动把 xPSR、PC、LR、R12、R3~R0 压入当前栈；若浮点使能还会保存 S0~S15/FPSCR。返回执行 BX LR（特殊值 0xFFFFFFF9 等）触发自动出栈并恢复。",explanation:"这就是“中断响应快”的原因——无需软件逐寄存器保存。",difficulty:3,tags:["原理推导"],tier:"familiar"},{category:"STM32",subcategory:"定时器",type:"qa",question:"STM32 定时器分几类？",answer:"基本定时器（TIM6/7，定时/DAC 触发）、通用定时器（TIM2~5，含 PWM/输入捕获/输出比较）、高级定时器（TIM1/8，带互补输出与死区）。",explanation:"选型看是否需要 PWM/互补/高级特性。",difficulty:1,tags:["高频","概念辨析"],tier:"must"},{category:"STM32",subcategory:"定时器",type:"qa",question:"定时器计数模式有哪些？PSC 和 ARR 的作用？",answer:"向上、向下、中心对齐。PSC 预分频得到计数时钟；ARR 自动重装值决定周期。溢出频率 f = 定时器时钟 / ((PSC+1)(ARR+1))。",explanation:"占空比由 CCR 比较值决定。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"定时器",type:"qa",question:"如何用定时器产生 PWM？占空比怎么算？",answer:"PWM 模式下 ARR 定周期、CCR 定比较值；当计数器<CCR 输出一种电平，否则另一种。\n  ```c\n  // 1kHz, 占空比 30% @ 72MHz, PSC=71 -> 1MHz 计数\n  htim.Instance->PSC = 71; htim.Instance->ARR = 999; // 1MHz/1000 = 1kHz\n  htim.Instance->CCR1 = 300;                          // 30% 占空比\n  ```",explanation:"占空比 = CCR/(ARR+1)。",difficulty:2,tags:["高频","场景设计"],tier:"must"},{category:"STM32",subcategory:"定时器",type:"qa",question:"输入捕获与输出比较的区别？",answer:"输入捕获测量外部信号边沿的时间戳（测频率/脉宽）；输出比较在计数器匹配设定值时执行动作（翻转/置位引脚）。",explanation:"两者共用同一个定时器通道，配置不同。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"定时器",type:"qa",question:"如何用输入捕获测一个脉冲宽度？",answer:"① 配通道为输入捕获，上升沿与下降沿都触发；② 第一次捕获上升沿记下 cnt1 并切换为下降沿；③ 下降沿捕获 cnt2；脉宽 = (cnt2-cnt1)/计数时钟；注意处理溢出（cnt 回绕）。",explanation:"高电平期间若计数器溢出，需累计溢出次数。",difficulty:3,tags:["场景设计"],tier:"familiar"},{category:"STM32",subcategory:"定时器",type:"qa",question:"什么是高级定时器的死区时间和互补输出？",answer:"高级定时器可输出 CHx 与 CHxN 互补对，中间插入死区（同时关断时间），防止电机驱动上下桥臂直通短路。死区由 BDTR 寄存器配置。",explanation:"半桥/全桥驱动必用。",difficulty:3,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"定时器",type:"qa",question:"定时器编码器接口模式原理？",answer:"定时器内部逻辑根据 TI1/TI2 两路正交信号的边沿和相位，自动对计数器加/减，从而实现正交编码器方向+脉冲计数。",explanation:"无需软件测边沿，硬件自动累加，精度高。",difficulty:3,tags:["原理推导"],tier:"familiar"},{category:"STM32",subcategory:"定时器",type:"qa",question:"只有高级定时器才能产生 PWM 吗？",answer:"错误。通用定时器同样支持 PWM；高级定时器额外提供互补输出与死区。",explanation:"常见误区。",difficulty:1,tags:["高频","概念辨析"],tier:"must"},{category:"STM32",subcategory:"通信外设·串口 USART",type:"qa",question:"串口基本参数有哪些？115200 8N1 什么意思？",answer:"波特率、数据位、停止位、校验位、流控。“115200 8N1”= 波特率 115200、8 数据位、无校验、1 停止位。",explanation:"主从双方参数必须一致。",difficulty:1,tags:["高频","概念辨析"],tier:"must"},{category:"STM32",subcategory:"通信外设·串口 USART",type:"qa",question:"USART 是全双工吗？为什么要共地？",answer:"USART 全双工（TX/RX 独立，可同时收发）；是单端电平，必须有共地提供相同参考电平，否则判断出错。",explanation:"和差分信号（如 RS485/CAN）不同，RS232/USART 电平依赖共地。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"通信外设·串口 USART",type:"qa",question:"中断收发和 DMA 收发各有什么优缺点？",answer:"中断每字节进一次 ISR，CPU 占用高、易溢出；DMA 由硬件自动搬运，几乎不占 CPU，适合大数据量。",explanation:"高波特率/连续数据流推荐 DMA+空闲中断(IDLE)收一帧。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"通信外设·串口 USART",type:"qa",question:"如何用“空闲中断+DMA”接收不定长一帧数据？",answer:"① DMA 循环搬运 RX 到缓冲区并记录 NDTR；② 开启 USART IDLE 中断；③ IDLE 触发时读 NDTR 算出本次收到长度，拷贝数据帧，重置指针。",explanation:"避免每字节中断，且能识别“一帧结束”。",difficulty:3,tags:["场景设计"],tier:"familiar"},{category:"STM32",subcategory:"通信外设·串口 USART",type:"qa",question:"什么是溢出错误(ORE)？怎么避免？",answer:"收到新字节时上一字节还没被读走就被覆盖，置 ORE。避免：用 DMA/空闲中断及时取走，或提高处理优先级。",explanation:"轮询慢时极易 ORE。",difficulty:2,tags:["故障排查"],tier:"familiar"},{category:"STM32",subcategory:"通信外设·串口 USART",type:"qa",question:"如何把 printf 重定向到串口？",answer:"重写 `_write`（或 `fputc`）调用串口发送：\n  ```c\n  int _write(int fd, char *buf, int len) {\n    HAL_UART_Transmit(&huart1, (uint8_t*)buf, len, -1);\n    return len;\n  }\n  ```",explanation:"需勾选微库（MicroLIB）或实现 syscalls。",difficulty:2,tags:["代码分析"],tier:"familiar"},{category:"STM32",subcategory:"通信外设·SPI",type:"qa",question:"SPI 有哪几根线？优缺点？",answer:"SCK、MOSI、MISO、SS（片选），全双工同步。优点：高速、全双工、协议简单；缺点：无寻址（靠片选）、占脚多、距离短、无硬件应答。",explanation:"主从靠 SS 选通，主机发起时钟。",difficulty:1,tags:["高频","概念辨析"],tier:"must"},{category:"STM32",subcategory:"通信外设·SPI",type:"qa",question:"SPI 的四种模式（CPOL/CPHA）是什么？主从必须一致吗？",answer:"CPOL 决定空闲时钟电平，CPHA 决定采样边沿，组合成 Mode0~3。主从模式必须一致否则数据错位。",explanation:"常见 Mode0（CPOL=0,CPHA=0）和 Mode3。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"通信外设·SPI",type:"qa",question:"SPI 和 I2C 怎么选？",answer:"速率高、数据量大、距离短、需全双工 → SPI（屏、Flash、SD）；设备多、布线紧、速率不高 → I2C（传感器、EEPROM）。",explanation:"SPI 无地址靠片选，I2C 靠地址寻址可挂多设备。",difficulty:2,tags:["高频","场景设计"],tier:"must"},{category:"STM32",subcategory:"通信外设·I2C",type:"qa",question:"I2C 用几根线？为什么要上拉电阻？",answer:"SDA、SCL 两根，开漏结构，靠外部上拉拉高，故必须上拉电阻；标准 100k、快速 400k。",explanation:"无上拉则无法输出高电平，总线失效。",difficulty:1,tags:["高频","概念辨析"],tier:"must"},{category:"STM32",subcategory:"通信外设·I2C",type:"qa",question:"I2C 的起始/停止条件、ACK 是什么？",answer:"SCL 高时 SDA 由高→低为起始，低→高为停止。每字节后接收方拉低 SDA 为 ACK，拉高为 NACK。",explanation:"主机发地址+读写位（最低位 R/W），从机 ACK 表示响应。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"通信外设·I2C",type:"qa",question:"什么是 I2C 总线仲裁与时钟同步？",answer:"多主时，设备都“线与”驱动 SDA，谁先输出 0 谁赢得仲裁（仲裁失败者退出发送）；时钟同步靠 SCL 的线与，慢主拉低会拖住快主。",explanation:"开漏+线与天然支持多主仲裁，无需额外冲突检测。",difficulty:3,tags:["原理推导"],tier:"familiar"},{category:"STM32",subcategory:"通信外设·I2C",type:"qa",question:"I2C 死锁（SDA 被从机拉低）怎么处理？",answer:"若从机在传输中复位把 SDA 拉低，主机可在 SCL 上手动产生 9 个时钟脉冲，让从机释放 SDA，随后发停止条件恢复。",explanation:"常见硬件 I2C 卡死恢复手段。",difficulty:3,tags:["故障排查"],tier:"familiar"},{category:"STM32",subcategory:"通信外设·CAN",type:"qa",question:"CAN 总线特点？为什么适合汽车/工业？",answer:"差分信号抗干扰、多主、基于报文 ID 非地址、非破坏性仲裁（ID 小优先级高）、有 CRC 与错误重传，实时可靠。",explanation:"适合噪声环境多节点通信。",difficulty:2,tags:["高频","概念辨析"],tier:"must"},{category:"STM32",subcategory:"通信外设·CAN",type:"qa",question:"CAN 的位仲裁机制？标准帧与扩展帧？",answer:"同时发送时，显性位(0)覆盖隐性位(1)，ID 越小优先级越高，失败方自动退出变接收。标准帧 11 位 ID，扩展帧 29 位 ID。",explanation:"非破坏性仲裁保证高优先级报文零延迟。",difficulty:2,tags:["原理推导"],tier:"familiar"},{category:"STM32",subcategory:"通信外设·CAN",type:"qa",question:"什么是 CAN 的位定时（同步段/传播段/相位段）与采样点？",answer:"一位时间分为 SS、PTS、PBS1、PBS2，采样点在 PBS1 末；通过同步跳转宽度 SJW 做重新同步，补偿时钟偏差。",explanation:"所有节点位时间参数需匹配，否则通信失败。",difficulty:3,tags:["原理推导"],tier:"familiar"},{category:"STM32",subcategory:"模拟外设·ADC/DAC",type:"qa",question:"12 位 ADC、Vref=3.3V，数字值与电压怎么换算？",answer:"电压 = 数字值/4095 × Vref；数字值 = 电压/Vref × 4095。例：测得 2048 → 1.65V。",explanation:"分辨率 12 位即 0~4095。",difficulty:1,tags:["高频","原理推导"],tier:"must"},{category:"STM32",subcategory:"模拟外设·ADC/DAC",type:"qa",question:"规则组和注入组的区别？",answer:"规则组按序常规转换；注入组可“插队”打断规则组（类似高优先级序列），常用于紧急采样。",explanation:"注入转换结果有独立数据寄存器。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"模拟外设·ADC/DAC",type:"qa",question:"采样时间长短有什么影响？如何用 DMA 配合 ADC？",answer:"采样越长对高内阻源越准但速率低；开连续扫描+DMA 循环搬运到数组，CPU 只读数，适合连续采集。",explanation:"多通道扫描常配 DMA 防溢出。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"模拟外设·ADC/DAC",type:"qa",question:"DAC 输出为什么要加电压跟随/缓冲？",answer:"DAC 输出阻抗较高、驱动弱，直接带负载会跌落；加运放电压跟随器隔离负载。",explanation:"精密输出要重视负载能力。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"DMA",type:"qa",question:"DMA 的作用？STM32 的 DMA 通道怎么分配？",answer:"直接存储器访问，外设↔内存（或内存↔内存）自动搬运，不占 CPU。每个 DMA 有若干通道/流，每个映射特定外设请求（查手册 DMA Request Mapping）。",explanation:"一个通道同一时刻通常只服务一个外设请求。",difficulty:1,tags:["高频","概念辨析"],tier:"must"},{category:"STM32",subcategory:"DMA",type:"qa",question:"什么是循环模式和双缓冲？",answer:"循环模式传完自动从头再来（适合 ADC 连续采样）；双缓冲（Double Buffer）提供两块内存，DMA 填一块时 CPU 处理另一块，避免覆盖。",explanation:"双缓冲常用于音频/高速采集。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"DMA",type:"qa",question:"DMA 与 CPU 会争用总线吗？什么是 DMA 突发？",answer:"会。AHB 总线上 DMA 与 CPU 竞争，DMA 突发(Burst)传输可一次占总线传多个字提高效率，但会短暂影响 CPU 取指；可配 DMA 优先级平衡。",explanation:"大数据 DMA 时 CPU 性能会略有下降。",difficulty:3,tags:["原理推导"],tier:"familiar"},{category:"STM32",subcategory:"低功耗",type:"qa",question:"STM32 低功耗模式有哪几种？区别？",answer:"Sleep（只停 CPU，外设跑）、Stop（关高速时钟，RAM/寄存器保留，唤醒快）、Standby（最低功耗，唤醒≈复位，RAM 丢失）。",explanation:"深度越大恢复越慢、丢失越多。",difficulty:2,tags:["高频","概念辨析"],tier:"must"},{category:"STM32",subcategory:"低功耗",type:"qa",question:"Stop 模式靠什么唤醒？如何降低功耗？",answer:"由 EXTI 外部中断、RTC 闹钟等唤醒。降功耗：关未用外设时钟、降频、用低功耗模式、合理选唤醒源、IO 设为模拟/固定电平避免漏电。",explanation:"未用 IO 浮空会漏电，应配为模拟或上下拉固定。",difficulty:2,tags:["场景设计"],tier:"familiar"},{category:"STM32",subcategory:"Flash 与启动",type:"qa",question:"STM32 的启动流程？BOOT 引脚作用？",answer:"上电/复位后，从 0x00000000（经 BOOT 映射）取初始 SP 和复位向量；BOOT0/BOOT1 决定映射到主 Flash / 系统存储器(ISP Bootloader) / SRAM。复位Handler 初始化并跳 main。",explanation:"从 SRAM 启动常用于调试（不改 Flash）。",difficulty:2,tags:["高频","原理推导"],tier:"must"},{category:"STM32",subcategory:"Flash 与启动",type:"qa",question:"中断向量表为什么有时要重定位（VTOR）？",answer:"向量表默认在 Flash 0x08000000；Bootloader 跳 APP 后，APP 向量表在偏移处，需设 SCB->VTOR = APP_BASE，否则中断仍进 Bootloader。",explanation:"IAP/OTA 必做的一步。\n  ```c\n  SCB->VTOR = FLASH_BASE | 0x8000; // APP 偏移 0x8000\n  ```",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"Flash 与启动",type:"qa",question:"为什么写 Flash 前要先擦除？IAP 升级流程？",answer:"Flash 只能把 1 写 0、不能把 0 写 1，故写前按页/扇区擦除（恢复全 1）。IAP：接收新固件（串口/网络）→ 擦目标扇区 → 写入 → 校验 → 跳转到新 APP（设 VTOR+复位栈）。",explanation:"写 Flash 期间不能取指该区，通常关中断。",difficulty:2,tags:["高频","场景设计"],tier:"must"},{category:"STM32",subcategory:"Flash 与启动",type:"qa",question:"选项字节(Option Bytes)是什么？",answer:"存放读保护(RDP)、写保护、看门狗软件/硬件、BOOT 配置等；改写需解锁并按特定时序，错误设置可能导致无法调试。",explanation:"RDP 等级 1 可防固件读出，等级 2 不可逆。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"调试",type:"qa",question:"什么是 HardFault？怎么定位？",answer:"总线/用法/存储错误都会升级为 HardFault。定位：触发后看 LR 判断栈（MSP/PSP），从栈取 PC 和 xPSR，结合 CFSR 寄存器判断错误类型（如 IMPRECIS 总线错、UNDEFINSTR、INVSTATE），再用 PC 反查代码/map 文件。",explanation:"常见原因：数组越界、非对齐访问、非法函数指针、栈溢出。",difficulty:3,tags:["高频","故障排查"],tier:"must"},{category:"STM32",subcategory:"调试",type:"qa",question:"栈溢出有哪些表现？如何排查与防护？",answer:"表现：局部变量被改、返回地址错乱、跑飞。排查：调大栈、避免大局部数组/深递归、用栈水印（启动时填 0xCD，运行后看被覆盖深度）、用 MPU 限制栈区。",explanation:"RTOS 每个任务有独立栈，需合理设置。",difficulty:3,tags:["故障排查"],tier:"familiar"},{category:"STM32",subcategory:"调试",type:"qa",question:"SWD 和 JTAG 区别？为什么常用 SWD？",answer:"JTAG 用 TCK/TMS/TDI/TDO（4+脚），SWD 只用 SWCLK/SWDIO（2 脚），占用引脚少、速度快，故调试常用 SWD。",explanation:"SWD 是 Cortex-M 专用的两线调试接口。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"实战与综合面试题",type:"qa",question:"程序下载后完全不运行，常见排查思路？",answer:"查 BOOT 引脚是否从主 Flash 启动；查 PLL/系统时钟配置（HSE 失败易跑飞）；查 VTOR 与链接脚本 FLASH_BASE 是否匹配；查初始栈顶是否落在合法 RAM；查是否开了看门狗没喂；查复位/电源电路。",explanation:"先确认“能不能进 main”——在 main 第一行点灯或打日志最直观。",difficulty:3,tags:["故障排查"],tier:"familiar"},{category:"STM32",subcategory:"实战与综合面试题",type:"qa",question:"什么是 FSMC/FMC？常用来接什么？",answer:"Flexible/Flex Memory Controller，把外部 SRAM/NAND/NOR/并口 LCD 挂到总线，像访问内存一样读写；FMC 还含 SDRAM 控制器。",explanation:"驱动大屏或外扩 RAM 常用。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"实战与综合面试题",type:"qa",question:"RTC 的作用与时钟源？掉电怎么维持？",answer:"RTC 提供日历时钟，时钟可用 LSE(32.768k) 或 LSI；靠后备电池(VBAT)在掉电时维持计数。",explanation:"低功耗待机常靠 RTC 闹钟唤醒。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"实战与综合面试题",type:"qa",question:"CRC 外设有什么用？",answer:"硬件计算数据校验和，验证固件/通信完整性，比软件 CRC 快且省 CPU。",explanation:"IAP 校验固件完整性常用。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"实战与综合面试题",type:"qa",question:"调试时用 ITM/DWT 能做什么？",answer:"ITM 经 SWO 引脚输出跟踪信息（类 printf）不占 UART；DWT 可做数据观察点/周期计数，配合 CoreSight 做性能分析。",explanation:"比串口打印更轻量，适合实时调试。",difficulty:3,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"实战与综合面试题",type:"qa",question:"独立看门狗(IWDG)和窗口看门狗(WWDG)怎么选？",answer:"IWDG 独立时钟、开启后难关，用于极端死机复位；WWDG 要求在窗口内喂狗，能检测“程序节奏异常”，用于需监控活性的场景。",explanation:"WWDG 更严格但更“智能”。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"实战与综合面试题",type:"qa",question:"定时器触发 ADC + DMA 的“同步采样”如何实现？",answer:"TIM 的 TRGO 配为更新事件触发 ADC 启动，ADC 用 DMA 循环搬运；多通道按固定周期精确同步采样，CPU 仅读数。",explanation:"采集/示波器类应用典型用法。",difficulty:3,tags:["场景设计"],tier:"familiar"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"Cortex-M3 / M4 / M7 架构差异对比",answer:`三者同为 ARMv7-M / ARMv7E-M 架构，哈佛结构、Thumb-2 指令集、NVIC，主要差异在外设与存储子系统：
  | 特性 | M3 | M4 | M7 |
  |---|---|---|---|
  | 主频典型 | 72MHz | 168MHz | 400~600MHz |
  | Flash/ART 加速 | 无（0 等待或适配） | 无 ART，自带 cache 预取 | ART Accelerator + I-Cache/D-Cache |
  | I-Cache / D-Cache | 无 | 无 | 有（4~64KB 可配） |
  | FPU | 无 | 单精度 FPU | 单/双精度 FPU |
  | DSP 指令 | 无 | SIMD、饱和运算、MAC | 增强 MAC、双精度 |
  | TCM（紧耦合内存） | 无 | 无 | 可选（ITCM/DTCM，零等待） |
  | 以太网/MAC | 无 | 无 | 可选 |
  | 指令预取 | 简单 3 级 | 3 级 | 6 级 + 分支预测 |
  | MPU | 8 区 | 8 区 | 8/16 区 |
  | 总线 | AHB-Lite | AHB-Lite + AHB 矩阵 | 多层 AXI + AHB |
  | 典型型号 | STM32F1 | STM32F4 | STM32F7/H7 |
  面试延伸：H7 是双核（M7+M4）或单 M7 480MHz，带 16KB+16KB I/D-Cache、AXI 矩阵、TCM，与 M7 单核有区别。`,explanation:"",difficulty:3,tags:["概念辨析"],tier:"aware"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"位带（Bit-Band）操作原理与应用",answer:`Cortex-M3/M4 将 1MB 别名区（SRBB：0x22000000 对应 0x20000000）映射为 32MB 位带别名区，每个比特展开为一个 32 位字，对该字的读写即对原位比特的原子读写。
  映射公式：
  \`\`\`c
  // bit_word_addr = bit_band_base + (byte_offset * 32) + (bit_num * 4)
  #define BITBAND(addr, bitnum)  ((volatile uint32_t*)(0x22000000 + \\
      (((uint32_t)(addr)) - 0x20000000)*32 + (bitnum)*4))
  // 外设区同理：bit_band_base = 0x42000000, region_base = 0x40000000
  *BITBAND(&GPIOA->ODR, 5) = 1;   // 等价 GPIOA->ODR |= (1<<5)，但为单指令原子操作
  \`\`\`
  优点：读改写三步合并为一次原子写，**天然临界区**，适合 ISR 与主循环共享标志位、单线协议（模拟 I2C/SPI 翻转 SDA）。注意：M7 也有位带但访问带宽不同；**编译器不会自动用位带**，需手写宏或 CMSIS 宏。`,explanation:"",difficulty:2,tags:["高频","原理推导"],tier:"must"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"SysTick 定时器作为 RTOS 心跳的配置要点",answer:`SysTick 是 24 位递减计数器，四个寄存器 CTRL/LOAD/VAL/CALIB。作为 RTOS tick 时：
  \`\`\`c
  SysTick->LOAD = SystemCoreClock / configTICK_RATE_HZ - 1; // 1ms
  SysTick->VAL  = 0;
  SysTick->CTRL = SysTick_CTRL_CLKSOURCE_Msk |  // 内核时钟
                  SysTick_CTRL_TICKINT_Msk   |  // 触发中断
                  SysTick_CTRL_ENABLE_Msk;
  NVIC_SetPriority(SysTick_IRQn, 15);           // 最低优先级
  \`\`\`
  要点：
  1. 必须用**内核时钟**（HCLK）而非 HCLK/8；
  2. 中断优先级必须设为**最低**（逻辑上 15，因 FreeRTOS 屏蔽高于 configMAX_SYSCALL 的中断），否则屏蔽临界区时 tick 也被屏蔽导致时间不准；
  3. HAL 中 \`HAL_Init()\` 默认配置 SysTick 为 1ms 作时基，若 RTOS 接管需把 \`HAL_Tick\` 频率与 tick 解耦；
  4. \`SysTick->VAL\` 读操作会自动清零，多 tick 丢失检测靠 Load/Val 判断超时。`,explanation:"",difficulty:2,tags:["场景设计"],tier:"familiar"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"Cortex-M 栈增长方向与异常栈帧布局",answer:`Cortex-M 栈向**低地址增长**（Full Descending）。两个栈指针：MSP（主栈）/PSP（进程栈），通过 CONTROL.SPSEL 选择。异常发生时硬件自动压栈 8 个寄存器（硬件栈帧）：
  \`\`\`text
  高地址
  +--------+  xPSR   (栈顶, SP 原来位置)
  +--------+  PC     (返回地址)
  +--------+  LR     (R14)
  +--------+  R12
  +--------+  R3
  +--------+  R2
  +--------+  R1
  +--------+  R0     ← 硬件压栈后 SP
  低地址
  \`\`\`
  浮点上下文（M4F）：若异常入口时 FPU 已激活且 CONFIG 未裁剪，额外压栈 S0-S15 + FPSCR，栈帧变为**扩展栈帧**（偏移 0x20），\`xPSR\` 不影响，但**中断嵌套时要注意栈空间 26 字而非 8 字**。FreeRTOS 每个任务栈帧初始布局：由软件伪造 R0-R3、R12、LR、PC、xPSR，即首次 PendSV 恢复后从任务函数入口运行。`,explanation:"",difficulty:2,tags:["原理推导"],tier:"familiar"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"MPU 内存保护单元配置",answer:`MPU 将内存映射划分为 8 个（M3/M4）或 16 个（M7）区域，每区有基址（对齐到区大小）、大小（2^(N+1)，4GB~32B）、访问权限（AP 域）、属性（TEX/C/B/S、可缓冲、可缓存、可否执行 XN）。
  \`\`\`c
  MPU->RNR  = 0;                                  // 区域号
  MPU->RBAR = 0x20000000;                         // 基址，须按区大小对齐
  MPU->RASR = (0 << MPU_RASR_SIZE_Pos) |          // 大小 2^6=64B? 按需
              (0x3 << MPU_RASR_AP_Pos)  |         // AP=11 全访问
              (1 << MPU_RASR_C_Pos)    |          // Cacheable
              (1 << MPU_RASR_B_Pos)    |          // Bufferable
              (0 << MPU_RASR_XN_Pos)   |          // 允许取指
              (1 << MPU_RASR_ENABLE_Pos);
  MPU->CTRL = MPU_CTRL_PRIVDEFENA_Msk | MPU_CTRL_ENABLE_Msk;
  \`\`\`
  要点：特权模式默认访问全部内存由 PRIVDEFENA 控制；可设 **子区域禁用**（SRD 8 位每区域）；访问违例触发 MemManage Fault， Fault 状态寄存器 \`CFSR\` 的 MMARVALID/MMFAR 给出违例地址。典型用途：RTOS 任务栈越界保护、只读数据区防改写、外设寄存器仅特权访问。`,explanation:"",difficulty:3,tags:["场景设计"],tier:"aware"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"中断尾嵌套与来迟中断",answer:`- **尾嵌套（Tail-chaining）**：前一个 ISR 压栈的内容尚未出栈（退出时），又来一个同级/更高优先级中断，硬件跳过出栈-再压栈，直接串接新中断帧，**省去 6~12 个时钟周期**，无额外延迟。
  - **来迟中断（Late-arrival）**：ISR 入口（压栈已完成、尚未执行首条指令）时到达一个更高优先级中断，若此时抢占已开放，CPU 立即转去处理高优先级中断，处理完再返回原 ISR——表现为"抢占提前到入口处"。
  - **出栈抢占（Stack-pop preemption）**：退栈过程中到达高优先级中断，则等退栈完成后才响应。
  意义：NVIC 零延迟中断设计，决定了 Cortex-M 中断延迟固定（12 周期）+ 尾嵌套/来迟优化，面试常考"为什么 M3 中断响应快"。`,explanation:"",difficulty:3,tags:["概念辨析"],tier:"aware"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"临界区与 PRIMASK / BASEPRI / FAULTMASK",answer:'三个特权级中断屏蔽寄存器：\n  - `PRIMASK`：置 1 屏蔽**除 HardFault/NMI 外所有**异常。FreeRTOS `taskENTER_CRITICAL()` 即设 PRIMASK（关全部可配置中断）。\n  - `BASEPRI`：屏蔽**优先级数值 ≥ BASEPRI** 的中断（数值小优先级高），可实现"只屏蔽部分低优先级中断"。FreeRTOS 用 `configMAX_SYSCALL_INTERRUPT_PRIORITY` 屏蔽"可调用 FreeRTOS API 的中断"，但保留更高优先级中断。\n  - `FAULTMASK`：置 1 仅放行 NMI，HardFault 也屏蔽，仅供 FaultHandler 使用。\n  代码：\n  ```c\n  __set_PRIMASK(1);  // 关中断\n  __set_BASEPRI(0x60 << 4);  // 屏蔽优先级 >= 0x60 的中断\n  __set_FAULTMASK(1);\n  ```\n  FreeRTOS 两套临界区：`taskENTER/EXIT_CRITICAL`（PRIMASK，最重）与 `portSET_INTERRUPT_MASK_FROM_ISR/portCLEAR`（BASEPRI，用于 ISR 内）。',explanation:"",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"HSE=8MHz 配置 PLL 到 168MHz 全流程计算",answer:`STM32F407：SYSCLK = PLL 输出；PLL 源选 HSE，经 PLLM（2~63）分频到 1~2MHz 送 VCO，再经 PLLN（64~432）倍频，最后 PLLP（2/4/6/8）分频。
  \`\`\`c
  // 目标 SYSCLK=168MHz, VCO 输入 2MHz, VCO 输出 336MHz, PLLP=2 → 168MHz
  RCC_PLLConfig(RCC_PLLSource_HSE, 8, 336, 2, 7);  // M=8 N=336 P=2 Q=7
  // APB1 预分频 4 → 42MHz（上限 42）; APB2 预分频 2 → 84MHz
  RCC_PCLK1Config(RCC_HCLK_Div4);
  RCC_PCLK2Config(RCC_HCLK_Div2);
  // Flash 等待周期：168MHz 需 5 WS（按电压范围与手册表）
  FLASH_SetLatency(FLASH_Latency_5);
  \`\`\`
  面试常考三条链：①VCO 输入必须 1~2MHz；②VCO 输出 100~432MHz；③APB1 ≤ 42MHz、APB2 ≤ 84MHz、Flash WS 查表。F1 系列则是 PLLMUL 9 倍（HSE 8M→72M），无 PLLM/N/P 三段式。`,explanation:"",difficulty:2,tags:["高频","原理推导"],tier:"must"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"时钟安全系统 CSS 与 HSE 失效处理",answer:"CSS 由寄存器 `RCC_CR` 的 CSSON 使能。原理：CSS 用 HSE 经 32 分频后与 LSE（或经 CSS 内部 HSI 比较器）比较，检测到 HSE 停振（丢失/过慢）时：①自动清除 RCC_CR 的 HSEON，停用 PLL；②强制切换 SYSCLK 源为 HSI；②触发 CSSI 中断（NMI 不可屏蔽路径或 EXTI）。\n  ```c\n  RCC_ClockSecuritySystemCmd(ENABLE);   // F1 风格\n  // F4: RCC->CR |= RCC_CR_CSSON;\n  void NMI_Handler(void) {\n      if (RCC_GetITStatus(RCC_IT_CSS)) { /* 记录/报警, 系统已切 HSI 8MHz */ }\n  }\n  ```\n  要点：CSS **只负责切换，不负责恢复**；中断里可安全跑（系统已在 HSI）；工程上需置标志位让主循环做安全处理（降频、重启外设时钟相关配置）。",explanation:"",difficulty:2,tags:["场景设计"],tier:"familiar"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"定时器时钟倍频（x1/x2）常考陷阱",answer:'APB 总线（PCLK1/PCLK2）若预分频系数 ≠ 1，则该总线上定时器的**输入时钟自动倍频 x2**（TIMxCLK = 2×PCLKx）；若分频=1 则 x1。这是初学者最常踩的坑：\n  - F407 默认：PCLK1=42MHz（分频4）→ TIM2/3/4/5 时钟 = **84MHz**；PCLK2=84MHz（分频2）→ TIM1/8 时钟 = **168MHz**。\n  - F103：PCLK1=36MHz（分频2）→ APB1 定时器 72MHz；PCLK2=72MHz（不分频）→ APB2 定时器 72MHz。\n  后果：直接按 PCLK 算 PWM 频率会**差 2 倍**。排查方法：读 `RCC_ClocksTypeDef` 里 `RCC_Clocks.PCLK1_Frequency` 再 ×2，或用 `HAL_RCC_GetPCLK1Freq()` 的手册规则。**凡看到"定时器时钟和总线时钟不一致"，第一反应查 APB 预分频器**。',explanation:"",difficulty:2,tags:["故障排查"],tier:"familiar"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"GPIO 输出速度配置与功耗/EMC",answer:`GPIO 速度（2MHz/25MHz/50MHz/100MHz，F4 起可配）控制输出驱动器的摆率（slew rate）：速度越高，边沿越陡，①动态功耗越大（P ≈ C·V²·f，陡沿使高频分量多）；②EMI 越强；③信号完整性越好（长线/高频方波需要）。
  经验法则：
  - 低速信号（LED、按键、低速片选）配**最低速度**省电降 EMI；
  - SPI ≥ 10MHz、MCO 时钟输出、PWM 高频侧配**高速**；
  - 同相位切换的并口总线（如 FSMC）用中高速，注意地弹；
  - 未用引脚建议配置为**模拟输入**（AIN）最低漏电流，不要悬空浮空输入。`,explanation:"",difficulty:2,tags:["概念分析"],tier:"familiar"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"JTAG/SWD 引脚复用冲突与释放",answer:'调试上电后默认占用 PA13(SWDIO)/PA14(SWCLK)，以及 PA15(JTDI)/PB3(JTDO)/PB4(NJTRST)。若应用中把这些口当普通 GPIO 用，会出现**下载后程序跑飞/无法再次下载**。\n  解法：仅保留 SWD、禁用 JTAG，需在复用前操作 `AFIO-MAPR/SWJ_CFG`：\n  ```c\n  RCC_APB2PeriphClockCmd(RCC_APB2Periph_AFIO, ENABLE);\n  GPIO_PinRemapConfig(GPIO_Remap_SWJ_JTAGDisable, ENABLE);  // F1: 禁JTAG留SWD\n  // F4:\n  GPIO_InitStruct.Pin = GPIO_PIN_15; GPIO_InitStruct.Mode = GPIO_MODE_INPUT; ...\n  HAL_GPIO_Init(GPIOA, &GPIO_InitStruct); // 释放 PA15\n  __HAL_AFIO_REMAP_SWJ_NOJTAG();          // 等价宏\n  ```\n  注意：`GPIO_Remap_SWJ_Disable`（全禁）会导致 SWD 也断，**下次无法下载**，除非靠 BOOT0 进 ISP；因此产品代码常用"禁 JTAG 留 SWD"两线模式。HAL 的 `__HAL_AFIO_REMAP_SWJ_ENABLE` 等宏对应 5 种组合。',explanation:"",difficulty:2,tags:["故障排查"],tier:"familiar"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"高级定时器 PWM 互补输出 + 死区 + 刹车",answer:`半桥/全桥驱动 MOS 管时，上下管若同时导通会短路炸管。高级定时器（TIM1/TIM8）的 BDTR 寄存器提供：
  - **MOE（主输出使能）**：总开关，清 0 立即屏蔽所有 PWM 输出（OC/OCN 进空闲电平）；
  - **DTG[7:0] 死区发生器**：互补通道插入死区，\`DTG = 0xx: t = DTG×tdtg\` 等分档（0~127 对应 0~10.16us@具体时钟）；
  - **BKE/BKP 刹车**：BKIN 引脚检测到有效电平立即关闭输出（MOE 清 0），可配极性、滤波，进 \`TIM1_BRK_IRQn\`；
  - **OSSI/OSSR**：空闲/失效时输出电平选择。
  \`\`\`c
  TIM_BDTRInitTypeDef bdtr = {0};
  bdtr.TIM_OSSRState = TIM_OSSRState_Enable;    // 失效后 RUN 模式输出空闲电平
  bdtr.TIM_OSSIState = TIM_OSSIState_Enable;
  bdtr.TIM_LOCKLevel = TIM_LOCKLevel_1;         // 写保护级别
  bdtr.TIM_DeadTime = 100;                      // 查表换算
  bdtr.TIM_Break = TIM_Break_Enable;
  bdtr.TIM_BreakPolarity = TIM_BreakPolarity_Low;
  bdtr.TIM_AutomaticOutput = TIM_AutomaticOutput_Enable; // MOE 自动置位
  TIM_BDTRConfig(TIM1, &bdtr);
  TIM_CtrlPWMOutputs(TIM1, ENABLE);  // 置 MOE
  \`\`\`
  死区计算：F4 手册 DTG 编码分 4 段，常用 \`DT = DTG × tDTS\`，tDTS = 1/TIMCLK。面试常问"上下管同时导通的后果与软硬件防护"——软件：死区 + 互锁；硬件：互锁/隔离驱动 IR2104。`,explanation:"",difficulty:3,tags:["场景设计"],tier:"aware"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"定时器级联/主从模式实现长计时与精确同步",answer:`单个 16 位定时器最大计到 65535，更长计时/更高精度用**级联**：TIM3 的更新事件（TRGO）作为 TIM2 的计数时钟（内部触发），TIM2 形成 32 位计数器。
  \`\`\`c
  // TIM3 每 1s 产生一次更新，作为 TIM2 的 TRGO
  TIM_SelectMasterSlaveMode(TIM3, ENABLE);          // TIM3 主模式
  TIM_SelectOutputTrigger(TIM3, TIM_TRGOSource_Update); // TRGO = 更新事件
  TIM_SelectInputTrigger(TIM2, TIM_TS_ITR2);        // TIM2 时钟源 = ITR2(TIM3)
  TIM_SelectSlaveMode(TIM2, TIM_SlaveMode_ExternalClockMode); // 外部时钟模式
  TIM_Cmd(TIM2, ENABLE);
  \`\`\`
  主从模式三要素：主模式（TRGO 选择：复位/使能/更新/比较脉冲）、从模式（触发选择 ITRx、模式：外部时钟/复位/门控/触发）、同步（TIM_SelectMasterSlaveMode）。应用：①长计时；②多定时器同步启动（广播 TRGO）；③PWM 同步移相；④输入捕获测多路同源频率。`,explanation:"",difficulty:3,tags:["原理推导"],tier:"aware"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"定时器编码器接口模式（正交解码）",answer:`电机编码器输出 A/B 两相 90° 相位差方波。定时器编码器模式将 TI1/TI2 作为时钟源，根据相位关系自动加/减计数，**4 倍频**（每相边沿都计数）：
  \`\`\`c
  TIM_EncoderInterfaceConfig(TIM2,
      TIM_EncoderMode_TI12,        // 双相四倍频
      TIM_ICPolarity_Rising, TIM_ICPolarity_Rising);
  TIM_SetCounter(TIM2, 0); TIM_Cmd(TIM2, ENABLE);
  int16_t cnt = TIM_GetCounter(TIM2);  // 有符号读取
  \`\`\`
  要点：①TI12 = 4 倍频，TI1/TI2 单独 = 2 倍频；②计数器是 16 位**有符号**读，过零由加减方向决定；③加减速时的抖动用 Z 相（index）清零校准；④读计数有竞态（读到低字节后高字节变化），STM32 定时器计数器为 32 位缓冲读（TIMx_CNT 一次 16 位但预装载读两次）——严谨做法是读两次校验或冻结计数；⑤正交解码也可用输入捕获（每边沿中断）但占用 CPU。`,explanation:"",difficulty:3,tags:["原理推导"],tier:"aware"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"输入捕获测频率与占空比（测频法/测周法）",answer:`输入捕获记录边沿时刻（CNT 值），两种测法：
  - **测周法**（高频信号）：捕获相邻两个上升沿，周期 Δt = ΔCNT / TIMCLK，f = 1/Δt。分辨率 = 1/TIMCLK，受定时器时钟限制。
  - **测频法**（低频信号）：固定闸门时间 T_gate（如 1s 由另一定时器定），计数脉冲数 N，f = N/T_gate。精度高但响应慢。
  - **占空比**：捕获上升沿与下降沿，CNT_H / (CNT_H + CNT_L)。
  \`\`\`c
  // 上升沿捕获 + 溢出累计（处理 CNT 回绕）
  void TIM2_IRQHandler(void) {
      if (TIM_GetITStatus(TIM2, TIM_IT_CC1)) {
          uint32_t now = TIM_GetCapture1(TIM2);
          period = now - last + (overflow_cnt * 0x10000);
          last = now; overflow_cnt = 0;
          freq = TIMCLK / period;
      }
      if (TIM_GetITStatus(TIM2, TIM_IT_Update)) overflow_cnt++;
  }
  \`\`\`
  注意：①输入捕获需配滤波（ICF）与极性；②CNT 回绕（16 位上溢/下溢）必须累计溢出次数；③测高频用测周法、测低频用测频法的**临界闸门**常考。`,explanation:"",difficulty:3,tags:["场景分析"],tier:"aware"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"I2C 时钟拉伸与仲裁机制",answer:`- **时钟拉伸（Clock Stretching）**：从机将 SCL 拉低保持，强制主机等待，用于从机处理数据慢（如 EEPROM 写周期）。标准做法：主机每次传输后查询 ACK 或延时（HAL_I2C_Mem_Write 内部轮询 AF=1 表示从机拉伸）。
  - **仲裁（Arbitration）**：多主机场景，SDA 开漏上拉，主机发送数据同时回读。若回读到不同（别的主机拉低而本机发 1）则**本机仲裁失败**，立即退出为主机接收模式，等待总线空闲。
  - 时序细节：起始/停止条件、9 位/位含 ACK、SMBus 超时（35ms）与 PEC 校验。
  常见故障：①上拉电阻选错（3.3V 常用 4.7k，长线/高速降到 2.2k，按 tr = 0.8473·R·C 计算）；②未处理 BUSY 标志（上一次停止条件未完成）；③从机地址位移（7 位地址左移 1 位，最低位 R/W）。`,explanation:"",difficulty:3,tags:["原理推导"],tier:"aware"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"SPI 多从机 NSS 管理与 CPOL/CPHA 陷阱",answer:`SPI 全双工同步，主从通过片选 NSS 选通。多从机两种方案：①一从一 NSS（GPIO 手动）；②NSS 不够用时用 GPIO 模拟 + 软件控制时序。
  \`\`\`c
  // 多从机：NSS 用 GPIO 软件管理，SPI_NSS_Soft
  SPI_SSOutputCmd(SPI1, ENABLE);   // 或 NSS 内部由 SSM 控制
  SPI_NSSInternalSoftwareConfig(SPI1, ENABLE); // SSM=1, SSI=1
  GPIO_ResetBits(GPIOA, GPIO_Pin_4);           // 选中从机0
  SPI_I2S_SendData(SPI1, data);
  while (SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_RXNE) == RESET);
  rx = SPI_I2S_ReceiveData(SPI1);
  GPIO_SetBits(GPIOA, GPIO_Pin_4);             // 释放
  \`\`\`
  CPOL/CPHA 常考：
  - **CPOL**：空闲时钟电平；**CPHA**：第几个边沿采样（0=第一个边沿采样，1=第二个边沿采样）。
  - 模式 0：CPOL=0, CPHA=0；模式 3：CPOL=1, CPHA=1（W25Q128/多数 Flash 用 Mode 0 或 Mode 3）。
  - 陷阱：主从模式不一致会收到 0x00 或 0xFF；NSS 由硬件管理（SSM=0）时若从机 NSS 被拉高，从机立即停止移位并置错误标志。
  - 高速注意：GPIO 速度、走线等长、避免跨时钟域采样违例。`,explanation:"",difficulty:3,tags:["场景设计"],tier:"aware"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"CAN 位仲裁、验收过滤与错误帧机制",answer:`CAN 多主无损仲裁：显性位（0）覆盖隐性位（1）。主机发送标识符同时回读，**发 1 读到 0 即仲裁失败退出**，因此标识符数值小者优先级高（逐位比较，标准帧 11 位）。
  STM32 bxCAN 要点：
  - 双 CAN（F4）或单 bxCAN（F1）；
  - 标识符过滤器：32 位屏蔽/列表模式，配置 \`CAN_FilterInitStructure.FilterIdHigh/Low\` + \`FilterMaskIdHigh/Low\`，掩码位=1 表示必须匹配；
  - 邮箱：发送邮箱 3 个、FIFO 接收 2 个（深度 3）；
  - 错误帧：位错误、ACK 错误、CRC 错误、格式错误、填充错误；TEC/REC 计数 → error-active → error-passive → bus-off（TEC>255）；
  - 总线恢复：bus-off 后 128 次 11 位隐性序列恢复。
  \`\`\`c
  // 标准帧 ID 0x123, 数据长度 8, 掩码全匹配（列表模式）
  CAN_FilterInitTypeDef f = {0};
  f.CAN_FilterNumber = 0;
  f.CAN_FilterMode = CAN_FilterMode_IdList;
  f.CAN_FilterScale = CAN_FilterScale_32bit;
  f.CAN_FilterIdHigh = 0x123 << 5;
  f.CAN_FilterMaskIdHigh = 0;
  f.CAN_FilterFIFOAssignment = 0;
  f.CAN_FilterActivation = ENABLE;
  \`\`\`
  面试常问：为什么 CAN 是非破坏性仲裁、CANFD 与 CAN 的区别（数据段 64 字节、可变速率、BRS）。`,explanation:"",difficulty:3,tags:["原理推导"],tier:"aware"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"USART 多机通信与 Modbus 从机实现要点",answer:`Modbus RTU 帧：地址 | 功能码 | 数据 | CRC16。从机关键点：
  1. **3.5 字符静默帧间隔**作为帧边界判据，用定时器实现（波特率 9600 时约 4ms）；
  2. 接收用 **IDLE 中断 + DMA 环形缓冲**，不要在每次 RXNE 中断里处理；
  3. CRC16（查表法 256 项预生成表）多项式 0xA001，初始 0xFFFF；
  4. 广播地址 0 不应答；异常响应置功能码最高位。
  \`\`\`c
  // IDLE 中断 + DMA 空闲接收
  void USART1_IRQHandler(void) {
      if (USART_GetITStatus(USART1, USART_IT_IDLE)) {
          uint8_t dummy = USART1->DR;        // 清 IDLE
          uint16_t len = BUF_SIZE - DMA_GetCurrDataCounter(DMA1_Channel5);
          modbus_process(buf, len);          // 解析一帧
          DMA_Cmd(DMA1_Channel5, DISABLE);
          DMA_SetCurrDataCounter(DMA1_Channel5, BUF_SIZE);
          DMA_Cmd(DMA1_Channel5, ENABLE);
      }
  }
  \`\`\`
  主机侧注意：发送后延时等应答超时（典型 50~100ms），避免连续发送导致从机处理不过来。`,explanation:"",difficulty:2,tags:["场景设计"],tier:"familiar"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"ADC 多通道规则组扫描 + DMA 连续采样",answer:`规则组最多 16 通道，扫描模式 + EOC 触发 DMA，实现多通道自动循环采集：
  \`\`\`c
  ADC_InitTypeDef adc = {0};
  adc.ADC_ScanConvMode = ENABLE;              // 扫描模式
  adc.ADC_ContinuousConvMode = ENABLE;        // 连续转换
  adc.ADC_NbrOfConversion = 3;
  ADC_Init(ADC1, &adc);
  ADC_RegularChannelConfig(ADC1, ADC_Channel_0, 1, ADC_SampleTime_144Cycles);
  ADC_RegularChannelConfig(ADC1, ADC_Channel_1, 2, ADC_SampleTime_144Cycles);
  ADC_RegularChannelConfig(ADC1, ADC_Channel_16, 3, ADC_SampleTime_144Cycles); // 内部温度
  ADC_DMACmd(ADC1, ENABLE);
  ADC_DMARequestAfterLastTransferCmd(ADC1, ENABLE);
  // DMA 循环模式，目标 uint16_t buf[3]
  \`\`\`
  要点：①规则组顺序即转换顺序；②DMA 设循环模式 + 半传输/全传输中断做双缓冲处理；③**每通道转换结束产生 EOC，序列结束产生 EOS**，DMA 请求在每次 EOC 触发（每通道一次请求）；④采样时间按源阻抗选择（高阻抗源要长采样）。`,explanation:"",difficulty:3,tags:["场景设计"],tier:"aware"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"ADC 注入组与模拟看门狗",answer:'- **注入组（Injected）**：最多 4 通道，**优先级高于规则组**。规则组转换中途，注入组触发（定时器 TRGO 或软件）会**打断**当前规则通道，先转注入组，完成后再继续规则组（上下文自动保存/恢复）。用于急需要监测的通道（过流保护）。\n  - **模拟看门狗（AWD）**：设高低门限 `HTR/LTR`，可对单通道或全部通道监测，越界产生 AWD 中断——用于软件层面紧急关断 PWM（配合刹车输入形成双重保护）。\n  ```c\n  ADC_AnalogWatchdogThresholdsConfig(ADC1, 3000, 4095);\n  ADC_AnalogWatchdogCmd(ADC1, ADC_AnalogWatchdog_SingleRegEnable); // 规则组单通道\n  ADC_AnalogWatchdogSingleChannelConfig(ADC1, ADC_Channel_10);\n  ADC_ITConfig(ADC1, ADC_IT_AWD, ENABLE);\n  ```\n  追问：规则组被打断后现场如何保存？答：注入组数据在 JDR1~4，规则组通过 EOC/OVR 位与恢复逻辑由硬件管理，编程上表现为"规则转换挂起-恢复"。',explanation:"",difficulty:3,tags:["概念分析"],tier:"aware"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"ADC 采样时间与源阻抗匹配",answer:`ADC 采样保持电容约 4~8pF（STM32 手册给出 Cadc ≈ 4pF + 采样开关电阻 ~1kΩ）。采样需 12 位精度建立：**τ = (R_source + R_on) × (C_adc + C_trace)**，建立到 1/2 LSB 需 t ≥ 9×τ。
  计算示例：源阻抗 1kΩ + R_on 1kΩ = 2kΩ，C_adc 4pF → τ = 8ns，9τ = 72ns，168MHz 下 ADC 时钟 21MHz（周期 47.6ns）→ 至少 2 个采样周期（1.5/7.5/13.5/28.5/41.5/55.5/71.5/239.5 周期档）。
  经验值：源阻抗 < 10kΩ 选 13.5~28.5 周期；带运放缓冲或低阻抗源可短采样提速率；**高阻抗传感器必须加电压跟随器**。总转换时间 =（采样时间 + 12.5 周期）× 通道数 / ADCCLK，决定最大采样率。`,explanation:"",difficulty:3,tags:["原理推导"],tier:"aware"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"DMA 双缓冲（DMDoubleBuffer）模式",answer:`双缓冲：两个内存区 M0/M1，DMA 交替填充，填充完一个切换到另一个并产生中断，CPU 处理刚填满的那个，实现"零等待"连续流：
  \`\`\`c
  DMA_DoubleBufferModeConfig(DMA2_Stream0, (uint32_t)buf_b, DMA_Memory_0); // 第二个缓冲
  DMA_DoubleBufferModeCmd(DMA2_Stream0, ENABLE);
  DMA_ITConfig(DMA2_Stream0, DMA_IT_HT | DMA_IT_TC, ENABLE); // 半传输+全传输
  void DMA2_Stream0_IRQHandler(void) {
      if (DMA_GetITStatus(DMA2_Stream0, DMA_IT_HT)) { process(buf_a); }
      if (DMA_GetITStatus(DMA2_Stream0, DMA_IT_TC)) { process(buf_b); }
      DMA_ClearITPendingBit(DMA2_Stream0, DMA_IT_HT | DMA_IT_TC);
  }
  \`\`\`
  F4 DMA 要点：①Stream/Channel 二维选择（DMA_Channel_x 对应外设请求）；②FIFO 模式（阈值、突发）；③外设-外设传输（如 ADC→DAC 或 DAC→USART）；④仲裁器（优先级）；⑤传输完成后若内存指针需更新用 \`DMA_SetCurrDataCounter\` 或双缓冲自动切换。典型应用：ADC 连续采样 + 音频 I2S、内存到内存的 memcpy 卸载。`,explanation:"",difficulty:3,tags:["场景设计"],tier:"aware"},{category:"STM32",subcategory:"热点难点专项·内核深度",type:"qa",question:"IAP / OTA Bootloader 完整设计",answer:`IAP（In-Application Programming）三区规划（F407，每区 128KB Sector）：
  - Sector 0~1（0x08000000）：Bootloader（含中断向量表）
  - Sector 2~5（0x08008000）：APP A
  - Sector 6~11（0x08020000）：APP B（或备份区/下载区）
  跳转核心代码（Boot 末尾）：
  \`\`\`c
  typedef void (*JumpFun)(void);
  void IAP_JumpToApp(uint32_t app_addr) {
      // 1. 关闭所有中断与 SysTick
      __disable_irq();
      SysTick->CTRL = 0; SysTick->LOAD = 0; SysTick->VAL = 0;
      // 2. 重定位向量表
      SCB->VTOR = app_addr;
      // 3. 取栈顶指针与复位句柄
      uint32_t sp = *(uint32_t*)app_addr;
      uint32_t pc = *(uint32_t*)(app_addr + 4);
      JumpFun jump = (JumpFun)pc;
      __set_MSP(sp);        // 设置主栈
      jump();               // 跳转到 APP 复位函数
  }
  \`\`\`
  判据（Boot 启动时检查）：
  \`\`\`c
  if (((*(uint32_t*)APP_ADDR) & 0x2FFE0000) == 0x20000000) { /* 栈顶合法 */ }
  if (OTA_FLAG == 0x12345678) { /* 升级标志有效 */ }
  \`\`\`
  升级流程：Boot 通过 USART/Ymodem 接收新固件到 APP B 区 → CRC32 校验 → 写升级标志 → 复位 → Boot 检测标志 → 拷贝 B→A（或直接跳 B）→ 清标志。安全要点：**跳转前必须关中断+关 SysTick**，否则残留中断用旧向量表跑飞；APP 的 \`SystemInit\` 前必须重设 VTOR（Keil 分散加载或代码里 \`SCB->VTOR = 0x08008000\`）；Flash 擦写期间严禁读同 Bank（ stall CPU 或代码搬 RAM 执行）。OTA 追加：双备份 + 回滚标志，防掉电变砖。`,explanation:"",difficulty:3,tags:["高频","场景设计"],tier:"must"}];export{t as default};
