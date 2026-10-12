const e=[{category:"C语言",subcategory:"关键修饰词",type:"qa",question:"volatile 的作用是什么？哪些场景必须用？",answer:'volatile 告诉编译器**该变量随时可能被外部改变**，禁止把读写优化掉（不缓存进寄存器、不删"多余"读取、不合并访问），每次都用 `ld/str` 直接访问内存。\n  必须使用的三类场景：\n  1. **内存映射寄存器**：`volatile uint32_t *sr = (volatile uint32_t*)0x40011000;` 轮询标志位，不加 volatile 优化后可能死循环（编译器认为值没变）。\n  2. **中断与主循环共享变量**：ISR 修改、main 读取的状态/计数。\n  3. **多线程共享变量**（裸 shared 场景；RTOS 里通常配合关中断/原子操作）。',explanation:'经典追问——**volatile ≠ 原子**：它只保证"每次都真读真写"，不保证读改写不可分割，`cnt++` 在中断竞争下依然会丢；真正的原子用 `__atomic_*`/CMSIS 位带/关中断。反例：给函数内纯局部的寄存器加 volatile 毫无意义（无外部改变者）。',difficulty:1,tags:["高频","概念辨析"],tier:"must"},{category:"C语言",subcategory:"关键修饰词",type:"qa",question:"static 在 C 里的三种用法？",answer:'1. **修饰文件内全局变量/函数**：作用域限制在本 .c（内部链接），其他文件不可见/不可链入——模块封装、防命名冲突，嵌入式库源码里几乎每个 .c 都有 `static uint8_t s_inited;`。\n  2. **修饰函数内局部变量**：存储期变为全程（放 .data/.bss 而非栈），只初始化一次，函数返回后值保留——实现状态机、计数器、单次初始化。\n  3. **结合 const 表达"模块私有常量表"**：`static const uint16_t crc_table[256]` 留在本文件不污染符号表。',explanation:'常考陷阱：①static 局部变量初始化只发生一次，`static int i = 0;` 第二次进入不再重置；②static 数组在 ISR 与任务共用**不是线程安全的**；③"static 函数不能被外部调用，但编译器更易内联优化"。',difficulty:1,tags:["高频","概念辨析"],tier:"must"},{category:"C语言",subcategory:"关键修饰词",type:"qa",question:"const 与指针组合的三层含义？",answer:"```c\n  const int *p;        // 指向常量的指针：*p 不可写，p 可指别处\n  int *const p;        // 常量指针：p 不可改指向，*p 可写\n  const int *const p;  // 都不可改\n  ```\n  记忆法：**const 紧邻 `*` 修饰指向的内容，紧邻变量名修饰指针本身**（从右往左读）。\n  硬件描述里三件套常并用：`volatile const uint32_t * const REG = ...` 只读寄存器的固定地址。",explanation:"函数参数加 const（`const char *s`）承诺不改调用者数据，接口即文档；返回值 const 指针防止调用方改内部状态（如 getenv）。",difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"C语言",subcategory:"内存与结构体",type:"qa",question:"结构体内存对齐规则？为什么要有对齐？",answer:"规则（默认按编译器对齐数，如 4 字节平台）：①第一个成员偏移 0；②每个成员的偏移是 **min(成员对齐值, 全局对齐值)** 的整数倍（不足补 padding）；③结构体总大小是**最大成员对齐值**的整数倍（末尾补齐）。\n  ```c\n  struct A { char c; int i; char d; };  // 32 位下 sizeof = 12：c(1)+pad(3)+i(4)+d(1)+pad(3)\n  struct B { char c; char d; int i; };  // 调整成员顺序后 sizeof = 8\n  ```\n  为什么对齐：①CPU 按对齐边界访问内存效率最高（总线一次搬运到位）；②**ARM Cortex-M 硬件对非对齐访问：普通 LDR/STR 部分场景可用，但外设寄存器、LDM/STM、双字访问会 HardFault（UNALIGNED 用法错）**。",explanation:"`__attribute__((packed))` 可强压成 1 字节对齐（协议/寄存器结构常用），代价是非对齐访问变慢或触发陷阱，且不能随意取成员地址；面试常给两个结构体让你算 sizeof 并排序省内存。",difficulty:2,tags:["高频","原理推导"],tier:"must"},{category:"C语言",subcategory:"内存与结构体",type:"qa",question:'char a[]="hello" 和 char *p="hello" 有什么区别？',answer:'- `char a[]="hello"`：把字符串常量**拷贝**到栈/全局数组里，a 是可修改的 6 字节数组；`sizeof(a)==6`；`a` 是常量地址不能自增。\n  - `char *p="hello"`：p 指向**只读段（.rodata）里的字符串字面量**；`sizeof(p)==4/8`（指针）；`p[0]=\'H\'` 在 MCU 上可能"碰巧能改"（Flash 上写无效或 BusFault），在 Linux 上直接 SIGSEGV；`p++` 合法。',explanation:'延伸常考：多个相同字面量可能被合并为一份；函数返回局部数组地址=悬空指针；`memcpy(p,"hi",2)` 写只读段是经典崩溃场景。',difficulty:2,tags:["概念辨析"],tier:"familiar"},{category:"C语言",subcategory:"位运算与笔试经典",type:"qa",question:'用宏实现寄存器位操作：置位/清位/翻转/判断，并写"一条表达式"判断 x 是否为 2 的幂',answer:`\`\`\`c
  #define BIT(n)          (1UL << (n))
  #define REG_SET(x, m)   ((x) |=  (m))     // 置位
  #define REG_CLR(x, m)   ((x) &= ~(m))     // 清位
  #define REG_TGL(x, m)   ((x) ^=  (m))     // 翻转
  #define REG_TST(x, m)   (((x) & (m)) != 0) // 判断
  // 2 的幂：x 只有一个二进制 1，x-1 会把最低位 1 变 0、低位全变 1，二者与为 0
  #define IS_POW2(x)      ((x) > 0 && ((x) & ((x) - 1)) == 0)
  \`\`\``,explanation:"要点：①用 `1UL` 防 32 位移位截断（`1<<31` 对有符号 int 是 UB）；②宏参数全加括号；③判断 2 的幂的 `&&` 短路顺序（x=0 时先排除）；④STM32 的 BSRR 就是硬件版置位/清位——原子、免读改写。",difficulty:1,tags:["高频","代码分析"],tier:"must"},{category:"C语言",subcategory:"位运算与笔试经典",type:"qa",question:"反转单链表：迭代与递归两种写法？",answer:`\`\`\`c
  // 迭代：三指针，时间 O(n) 空间 O(1)
  ListNode *reverse(ListNode *head) {
      ListNode *prev = NULL, *cur = head, *next;
      while (cur) { next = cur->next; cur->next = prev; prev = cur; cur = next; }
      return prev;
  }
  // 递归：O(n) 空间（栈深）
  ListNode *reverse(ListNode *head) {
      if (!head || !head->next) return head;
      ListNode *newHead = reverse(head->next);
      head->next->next = head;
      head->next = NULL;
      return newHead;
  }
  \`\`\``,explanation:"白板题常客，嵌入式岗会追问：①**中断里不能用递归**（栈深不可控）；②嵌入式更常用**侵入式链表**（Linux list_head）与**自由链 free list** 管理固定大小节点池；③变体：反转前 K 个/判环（快慢指针）/合并有序链表。",difficulty:2,tags:["代码分析"],tier:"familiar"},{category:"C语言",subcategory:"位运算与笔试经典",type:"qa",question:"动态内存（malloc/free）在嵌入式里的坑与正确姿势？",answer:'坑：①不判返回值 NULL 直接用（小 RAM 系统分配失败很常见）；②**double free / use-after-free**（free 后野指针继续读写，症状滞后且随机）；③只 free 结构体不 free 内部指针（浅拷贝泄漏）；④realloc 失败返回 NULL 且原块保留（别 `p=realloc(p,n)` 直接接）；⑤碎片化导致"总量够但分配失败"（长跑系统典型）。\n  姿势：free 后置 NULL；分配检查；**优先静态池/对象池**；RTOS 用 pvPortMalloc/vPortFree（heap_4）；开启工具：valgrind/ASan（Linux 侧）、FreeRTOS `xPortGetMinimumEverFreeHeapSize` + malloc 失败钩子（MCU 侧）。',explanation:'面试标准话术："嵌入式不是不能用堆，而是要**让堆的使用可审计、可预测**——要么全静态，要么集中封装带监控的分配器。"',difficulty:2,tags:["故障排查"],tier:"familiar"}];export{e as default};
