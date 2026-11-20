import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

type InventoryTab='items'|'movements'|'warehouses';
type MovementType='ورود'|'خروج'|'انتقال';
interface Warehouse {id:number;code:string;name:string;location:string;manager:string;status:'فعال'|'غیرفعال';}
interface StockLevel {warehouseId:number;quantity:number;}
interface InventoryItem {id:number;sku:string;name:string;category:string;unit:string;minStock:number;stocks:StockLevel[];unitCost:number;supplier:string;assetLink:string;description:string;}
interface StockMovement {id:number;code:string;type:MovementType;itemId:number;quantity:number;date:string;warehouseId:number;targetWarehouseId?:number;reference:string;actor:string;notes:string;}
@Component({
 selector:'ah-inventory',standalone:true,imports:[FormsModule,DecimalPipe],styleUrl:'./inventory.scss',
 template:`
 <div class="inventory-page" dir="rtl">
  <header class="page-head"><div><div class="eyebrow"><span></span> مدیریت منابع و موجودی سازمان</div><h1>مدیریت انبار و موجودی</h1><p>موجودی کالاها، گردش ورود و خروج و انتقال بین انبارها را یکپارچه کنترل کنید.</p></div><div class="head-actions"><button class="btn ghost" type="button" (click)="exportCsv()">↓ خروجی CSV</button><button class="btn primary" type="button" (click)="openItem()">＋ ثبت کالای جدید</button></div></header>
  <section class="hero"><div><span class="hero-kicker">ASHKAN / INVENTORY CONTROL</span><h2>دید کامل بر موجودی؛ از دریافت تا مصرف</h2><p>سطح موجودی، حد سفارش مجدد و گردش کالاها را در تمام انبارها پایش کنید.</p><div class="hero-tags"><span>✓ ردیابی گردش کالا</span><span>✓ هشدار کمبود موجودی</span><span>✓ انتقال بین انبارها</span></div></div><div class="hero-visual"><div class="orb"></div><div class="shelf"><i></i><i></i><i></i><b>STOCK</b></div><div class="cube">▦</div></div></section>
  <section class="metrics">
   <article><span class="metric-icon blue">▤</span><div><small>اقلام ثبت‌شده</small><strong>{{items().length}}</strong><em>شناسه کالای فعال</em></div></article>
   <article><span class="metric-icon green">▣</span><div><small>تعداد کل موجودی</small><strong>{{totalQuantity()|number}}</strong><em>واحد کالا در انبارها</em></div></article>
   <article><span class="metric-icon amber">⚑</span><div><small>اقلام زیر حداقل</small><strong>{{lowStockItems().length}}</strong><em>نیازمند تأمین یا انتقال</em></div></article>
   <article><span class="metric-icon violet">⌂</span><div><small>انبارهای فعال</small><strong>{{activeWarehouses()}}</strong><em>مراکز نگهداری کالا</em></div></article>
  </section>
  <section class="attention" [class.has-alert]="lowStockItems().length>0"><div class="attention-icon">!</div><div class="attention-copy"><b>{{lowStockItems().length? 'هشدار موجودی و سفارش مجدد':'وضعیت موجودی مطلوب است'}}</b><small>{{lowStockItems().length? 'اقلام زیر به حداقل موجودی رسیده‌اند و نیازمند بررسی هستند.':'در حال حاضر کالایی پایین‌تر از حداقل موجودی ثبت نشده است.'}}</small></div><div class="attention-list">@for(item of lowStockItems().slice(0,3);track item.id){<span>{{item.name}} · {{itemTotal(item)}} {{item.unit}}</span>}</div></section>
  <nav class="tabs"><button [class.active]="tab()==='items'" (click)="tab.set('items')">فهرست کالاها <span>{{items().length}}</span></button><button [class.active]="tab()==='movements'" (click)="tab.set('movements')">گردش موجودی <span>{{movements().length}}</span></button><button [class.active]="tab()==='warehouses'" (click)="tab.set('warehouses')">انبارها <span>{{warehouses().length}}</span></button></nav>
  @if(tab()==='items'){
   <section class="panel"><div class="toolbar"><div><h2>فهرست کالا و موجودی</h2><p>جستجو، فیلتر و مشاهده موجودی هر قلم در انبارهای مختلف</p></div><div class="filters"><input [value]="search()" (input)="search.set(valueOf($event))" placeholder="جستجوی نام یا کد کالا..." aria-label="جستجوی کالا"><select [value]="categoryFilter()" (change)="categoryFilter.set(valueOf($event))"><option value="">همه دسته‌ها</option>@for(c of categories();track c){<option [value]="c">{{c}}</option>}</select><select [value]="stockFilter()" (change)="stockFilter.set(valueOf($event))"><option value="">همه وضعیت‌ها</option><option value="low">کمتر از حداقل</option><option value="ok">موجودی کافی</option><option value="zero">ناموجود</option></select></div></div>
    <div class="table-wrap"><table><thead><tr><th>کالا</th><th>دسته‌بندی</th><th>موجودی کل</th><th>حداقل موجودی</th><th>ارزش موجودی</th><th>تأمین‌کننده</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody>
     @for(item of filteredItems();track item.id){<tr><td><b class="item-name">{{item.name}}</b><small class="sub">{{item.sku}} · {{item.unit}}</small></td><td>{{item.category}}</td><td><b>{{itemTotal(item)|number}}</b><small class="sub">{{stockBreakdown(item)}}</small></td><td>{{item.minStock|number}}</td><td>{{(itemTotal(item)*item.unitCost)|number}} <small class="sub">ریال</small></td><td>{{item.supplier||'—'}}</td><td><span class="status" [attr.data-state]="stockState(item)">{{stockStateLabel(item)}}</span></td><td><div class="actions"><button class="mini" (click)="openMovement(item,'ورود')">ورود</button><button class="mini" (click)="openMovement(item,'خروج')">خروج</button><button class="mini" (click)="openMovement(item,'انتقال')">انتقال</button><button class="mini edit" (click)="editItem(item)">ویرایش</button></div></td></tr>}@empty{<tr><td colspan="8"><div class="empty"><b>کالایی پیدا نشد</b><span>فیلترها را تغییر دهید یا کالای جدید ثبت کنید.</span></div></td></tr>}
    </tbody></table></div><footer class="table-foot"><span>{{filteredItems().length}} کالا از {{items().length}}</span><span>موجودی‌ها به تفکیک انبار محاسبه می‌شوند.</span></footer>
   </section>
  }
  @if(tab()==='movements'){
   <section class="panel"><div class="toolbar"><div><h2>دفتر گردش موجودی</h2><p>سوابق ورود، خروج و انتقال کالا بین انبارها</p></div><select [value]="movementFilter()" (change)="movementFilter.set(valueOf($event))"><option value="">همه عملیات</option><option value="ورود">ورود</option><option value="خروج">خروج</option><option value="انتقال">انتقال</option></select></div>
    <div class="table-wrap"><table><thead><tr><th>شناسه گردش</th><th>نوع عملیات</th><th>کالا</th><th>مقدار</th><th>مبدأ / انبار</th><th>مقصد</th><th>تاریخ</th><th>مرجع / ثبت‌کننده</th></tr></thead><tbody>
     @for(m of filteredMovements();track m.id){<tr><td><b class="item-name">{{m.code}}</b></td><td><span class="movement-type" [attr.data-type]="m.type">{{m.type}}</span></td><td>{{itemName(m.itemId)}}</td><td>{{m.quantity|number}}</td><td>{{warehouseName(m.warehouseId)}}</td><td>{{m.targetWarehouseId?warehouseName(m.targetWarehouseId):'—'}}</td><td>{{m.date}}</td><td>{{m.reference||'—'}}<small class="sub">{{m.actor}}</small></td></tr>}@empty{<tr><td colspan="8"><div class="empty"><b>گردشی ثبت نشده است</b><span>از فهرست کالاها یک عملیات ورود، خروج یا انتقال ثبت کنید.</span></div></td></tr>}
    </tbody></table></div>
   </section>
  }
  @if(tab()==='warehouses'){
   <section class="warehouse-grid">@for(w of warehouses();track w.id){<article class="warehouse-card"><div class="warehouse-top"><span class="warehouse-icon">⌂</span><span class="warehouse-status" [class.off]="w.status==='غیرفعال'">{{w.status}}</span></div><h3>{{w.name}}</h3><small>{{w.code}}</small><div class="warehouse-meta"><span>موقعیت</span><b>{{w.location}}</b><span>مسئول انبار</span><b>{{w.manager}}</b><span>تعداد اقلام</span><b>{{warehouseItemCount(w.id)}} قلم</b><span>تعداد واحد موجود</span><b>{{warehouseTotal(w.id)|number}}</b></div><div class="warehouse-bar"><i [style.width.%]="warehouseLoad(w.id)"></i></div><small class="capacity-label">شاخص موجودی نسبی</small></article>}</section>
  }
  <section class="note"><span>✦</span><div><b>یادداشت نسخه فعلی</b><p>اطلاعات کالاها، انبارها و گردش‌ها در این فاز نمونه و در حافظه نشست نگهداری می‌شوند. کنترل دسترسی، شمارش دوره‌ای، بارکد و QR، رزرو موجودی، انبارگردانی، یکپارچگی با سفارش خرید و دارایی‌ها و ثبت حسابرسی در فاز بک‌اند تکمیل خواهند شد.</p></div></section>

  @if(itemDialog()){<div class="overlay" (click)="closeItem()"><section class="dialog" role="dialog" aria-modal="true" (click)="$event.stopPropagation()"><header><div><h2>{{editingItemId()?'ویرایش مشخصات کالا':'ثبت کالای جدید'}}</h2><p>اطلاعات پایه کالا و نقطه سفارش مجدد را مشخص کنید.</p></div><button class="close" (click)="closeItem()">×</button></header><div class="form-grid">
   <label>نام کالا *<input [(ngModel)]="itemForm.name" placeholder="مثلاً ماوس بی‌سیم"></label><label>کد کالا / SKU *<input [(ngModel)]="itemForm.sku" placeholder="IT-MOU-001"></label>
   <label>دسته‌بندی<select [(ngModel)]="itemForm.category"><option>تجهیزات IT</option><option>قطعات و لوازم جانبی</option><option>ملزومات اداری</option><option>شبکه و زیرساخت</option><option>مصرفی</option><option>سایر</option></select></label><label>واحد شمارش<input [(ngModel)]="itemForm.unit" placeholder="عدد / بسته / متر"></label>
   <label>حداقل موجودی<input type="number" min="0" [(ngModel)]="itemForm.minStock"></label><label>بهای واحد (ریال)<input type="number" min="0" [(ngModel)]="itemForm.unitCost"></label>
   <label>تأمین‌کننده<input [(ngModel)]="itemForm.supplier" placeholder="نام تأمین‌کننده"></label><label>دارایی مرتبط<input [(ngModel)]="itemForm.assetLink" placeholder="شناسه دارایی یا گروه"></label>
   <label class="wide">توضیحات<textarea rows="3" [(ngModel)]="itemForm.description"></textarea></label>
   @if(!editingItemId()){<label>انبار اولیه<select [(ngModel)]="itemForm.warehouseId">@for(w of activeWarehouseList();track w.id){<option [ngValue]="w.id">{{w.name}}</option>}</select></label><label>موجودی اولیه<input type="number" min="0" [(ngModel)]="itemForm.initialStock"></label>}
  </div><footer><button class="btn ghost" (click)="closeItem()">انصراف</button><button class="btn primary" (click)="saveItem()">ذخیره کالا</button></footer></section></div>}
  @if(movementDialog()){<div class="overlay" (click)="closeMovement()"><section class="dialog compact" role="dialog" aria-modal="true" (click)="$event.stopPropagation()"><header><div><h2>ثبت {{movementForm.type}} موجودی</h2><p>{{movementItem()?.name}} · {{movementItem()?.sku}}</p></div><button class="close" (click)="closeMovement()">×</button></header>
   <div class="form-grid"><label>نوع عملیات<select [(ngModel)]="movementForm.type"><option>ورود</option><option>خروج</option><option>انتقال</option></select></label><label>مقدار *<input type="number" min="1" [(ngModel)]="movementForm.quantity"></label>
    <label>انبار مبدأ / مقصد ورود<select [(ngModel)]="movementForm.warehouseId">@for(w of activeWarehouseList();track w.id){<option [ngValue]="w.id">{{w.name}}</option>}</select></label>
    @if(movementForm.type==='انتقال'){<label>انبار مقصد<select [(ngModel)]="movementForm.targetWarehouseId">@for(w of activeWarehouseList();track w.id){@if(w.id!==movementForm.warehouseId){<option [ngValue]="w.id">{{w.name}}</option>}}</select></label>}
    <label>شماره مرجع<input [(ngModel)]="movementForm.reference" placeholder="شماره سفارش، حواله یا سند"></label><label>ثبت‌کننده<input [(ngModel)]="movementForm.actor"></label><label class="wide">توضیحات<textarea rows="2" [(ngModel)]="movementForm.notes"></textarea></label>
   </div><div class="stock-hint">موجودی فعلی در انبار انتخاب‌شده: <b>{{stockAt(movementItem(),movementForm.warehouseId)|number}}</b> {{movementItem()?.unit}}</div><footer><button class="btn ghost" (click)="closeMovement()">انصراف</button><button class="btn primary" (click)="saveMovement()">ثبت گردش</button></footer>
  </section></div>}
  @if(toast()){<div class="toast" role="status">{{toast()}}</div>}
 </div>
 `
})
export class InventoryComponent{
 readonly warehouses=signal<Warehouse[]>([
  {id:1,code:'WH-TEH-01',name:'انبار مرکزی تهران',location:'تهران · ساختمان مرکزی',manager:'محمد رضایی',status:'فعال'},
  {id:2,code:'WH-TEH-02',name:'انبار تجهیزات فناوری',location:'تهران · طبقه همکف',manager:'علی مرادی',status:'فعال'},
  {id:3,code:'WH-HMD-01',name:'انبار شعبه همدان',location:'همدان · شعبه غرب',manager:'سارا احمدی',status:'فعال'},
  {id:4,code:'WH-ARCH-01',name:'انبار اقلام اسقاطی',location:'تهران · ساختمان پشتیبان',manager:'واحد تدارکات',status:'غیرفعال'}
 ]);
 readonly items=signal<InventoryItem[]>([
  {id:1,sku:'IT-LAP-001',name:'لپ‌تاپ سازمانی ۱۵ اینچ',category:'تجهیزات IT',unit:'دستگاه',minStock:4,stocks:[{warehouseId:1,quantity:8},{warehouseId:2,quantity:3},{warehouseId:3,quantity:1}],unitCost:85000000,supplier:'فناوران آریا',assetLink:'دارایی‌های IT',description:'لپ‌تاپ استاندارد کاربران سازمان'},
  {id:2,sku:'IT-MOU-014',name:'ماوس بی‌سیم',category:'قطعات و لوازم جانبی',unit:'عدد',minStock:12,stocks:[{warehouseId:1,quantity:6},{warehouseId:2,quantity:2},{warehouseId:3,quantity:0}],unitCost:850000,supplier:'تجهیزگستر پارس',assetLink:'',description:'ماوس بی‌سیم اداری'},
  {id:3,sku:'NET-SW-008',name:'سوئیچ شبکه ۲۴ پورت',category:'شبکه و زیرساخت',unit:'دستگاه',minStock:2,stocks:[{warehouseId:1,quantity:3},{warehouseId:2,quantity:1},{warehouseId:3,quantity:1}],unitCost:42000000,supplier:'داده‌پردازان شرق',assetLink:'دارایی شبکه',description:'سوئیچ مدیریتی گیگابیتی'},
  {id:4,sku:'OFF-PAP-A4',name:'کاغذ A4 بسته ۵۰۰ عددی',category:'ملزومات اداری',unit:'بسته',minStock:20,stocks:[{warehouseId:1,quantity:38},{warehouseId:2,quantity:12},{warehouseId:3,quantity:15}],unitCost:280000,supplier:'بازرگانی آفتاب',assetLink:'',description:'کاغذ سفید ۸۰ گرمی'},
  {id:5,sku:'NET-CAT6-100',name:'کابل شبکه CAT6',category:'شبکه و زیرساخت',unit:'متر',minStock:50,stocks:[{warehouseId:1,quantity:120},{warehouseId:2,quantity:35},{warehouseId:3,quantity:20}],unitCost:45000,supplier:'داده‌پردازان شرق',assetLink:'',description:'کابل شبکه مسی'}
 ]);
 readonly movements=signal<StockMovement[]>([
  {id:1,code:'ST-1405-041',type:'ورود',itemId:1,quantity:5,date:'1405/08/26',warehouseId:1,reference:'PO-1405-006',actor:'محمد رضایی',notes:'دریافت سفارش خرید'},
  {id:2,code:'ST-1405-040',type:'خروج',itemId:2,quantity:3,date:'1405/08/25',warehouseId:1,reference:'IT-REQ-128',actor:'علی مرادی',notes:'تحویل به واحد پشتیبانی'},
  {id:3,code:'ST-1405-039',type:'انتقال',itemId:4,quantity:10,date:'1405/08/24',warehouseId:1,targetWarehouseId:3,reference:'TR-1405-009',actor:'سارا احمدی',notes:'تأمین موجودی شعبه'}
 ]);
 readonly tab=signal<InventoryTab>('items');readonly search=signal('');readonly categoryFilter=signal('');readonly stockFilter=signal('');readonly movementFilter=signal('');
 readonly itemDialog=signal(false);readonly movementDialog=signal(false);readonly editingItemId=signal<number|null>(null);readonly movementItem=signal<InventoryItem|null>(null);readonly toast=signal('');
 itemForm=this.emptyItemForm();movementForm={type:'ورود' as MovementType,quantity:1,warehouseId:1,targetWarehouseId:2,reference:'',actor:'محمد رضایی',notes:''};
 private nextItem=6;private nextMovement=4;private toastTimer?:ReturnType<typeof setTimeout>;
 readonly totalQuantity=computed(()=>this.items().reduce((sum,x)=>sum+this.itemTotal(x),0));
 readonly lowStockItems=computed(()=>this.items().filter(x=>this.itemTotal(x)<=x.minStock));
 readonly activeWarehouses=computed(()=>this.warehouses().filter(x=>x.status==='فعال').length);
 readonly categories=computed(()=>[...new Set(this.items().map(x=>x.category))]);
 readonly activeWarehouseList=computed(()=>this.warehouses().filter(x=>x.status==='فعال'));
 readonly filteredItems=computed(()=>this.items().filter(x=>(!this.categoryFilter()||x.category===this.categoryFilter())&&(!this.search()||`${x.name} ${x.sku} ${x.supplier}`.toLowerCase().includes(this.search().trim().toLowerCase()))&&(this.stockFilter()==='low'?this.itemTotal(x)<=x.minStock:this.stockFilter()==='ok'?this.itemTotal(x)>x.minStock:this.stockFilter()==='zero'?this.itemTotal(x)===0:true)));
 readonly filteredMovements=computed(()=>this.movements().filter(x=>!this.movementFilter()||x.type===this.movementFilter()));
 valueOf(event:Event):string{return (event.target as HTMLInputElement).value;}
 private emptyItemForm(){return{name:'',sku:'',category:'تجهیزات IT',unit:'عدد',minStock:0,unitCost:0,supplier:'',assetLink:'',description:'',warehouseId:1,initialStock:0};}
 itemTotal(item:InventoryItem):number{return item.stocks.reduce((sum,x)=>sum+x.quantity,0);}
 stockAt(item:InventoryItem|null,warehouseId:number):number{return item?.stocks.find(x=>x.warehouseId===warehouseId)?.quantity||0;}
 stockBreakdown(item:InventoryItem):string{return item.stocks.filter(x=>x.quantity>0).map(x=>`${this.warehouseName(x.warehouseId)}: ${x.quantity}`).join(' · ')||'بدون موجودی';}
 stockState(item:InventoryItem):'low'|'ok'|'zero'{const n=this.itemTotal(item);return n===0?'zero':n<=item.minStock?'low':'ok';}
 stockStateLabel(item:InventoryItem):string{return this.stockState(item)==='zero'?'ناموجود':this.stockState(item)==='low'?'کمتر از حداقل':'موجودی کافی';}
 warehouseName(id:number):string{return this.warehouses().find(x=>x.id===id)?.name||'—';}
 itemName(id:number):string{return this.items().find(x=>x.id===id)?.name||'کالای حذف‌شده';}
 warehouseItemCount(id:number):number{return this.items().filter(x=>this.stockAt(x,id)>0).length;}
 warehouseTotal(id:number):number{return this.items().reduce((sum,x)=>sum+this.stockAt(x,id),0);}
 warehouseLoad(id:number):number{return Math.min(100,Math.round(this.warehouseTotal(id)/100*100));}
 openItem(){this.editingItemId.set(null);this.itemForm=this.emptyItemForm();this.itemDialog.set(true);}
 editItem(item:InventoryItem){this.editingItemId.set(item.id);this.itemForm={...this.emptyItemForm(),name:item.name,sku:item.sku,category:item.category,unit:item.unit,minStock:item.minStock,unitCost:item.unitCost,supplier:item.supplier,assetLink:item.assetLink,description:item.description};this.itemDialog.set(true);}
 closeItem(){this.itemDialog.set(false);}
 saveItem(){
  const f=this.itemForm;if(!f.name.trim()||!f.sku.trim()||f.minStock<0||f.unitCost<0){this.notify('نام، کد کالا و مقادیر معتبر را وارد کنید.');return;}
  const duplicate=this.items().some(x=>x.sku.toLowerCase()===f.sku.trim().toLowerCase()&&x.id!==this.editingItemId());if(duplicate){this.notify('این کد کالا قبلاً ثبت شده است.');return;}
  if(this.editingItemId()){const id=this.editingItemId()!;this.items.update(list=>list.map(x=>x.id===id?{...x,name:f.name.trim(),sku:f.sku.trim(),category:f.category,unit:f.unit,minStock:Number(f.minStock),unitCost:Number(f.unitCost),supplier:f.supplier,assetLink:f.assetLink,description:f.description}:x));this.notify('مشخصات کالا به‌روزرسانی شد.');}
  else{const item:InventoryItem={id:this.nextItem++,sku:f.sku.trim(),name:f.name.trim(),category:f.category,unit:f.unit,minStock:Number(f.minStock),stocks:[{warehouseId:Number(f.warehouseId),quantity:Math.max(0,Number(f.initialStock))}],unitCost:Number(f.unitCost),supplier:f.supplier,assetLink:f.assetLink,description:f.description};this.items.update(list=>[item,...list]);this.notify('کالای جدید به فهرست انبار اضافه شد.');}
  this.itemDialog.set(false);
 }
 openMovement(item:InventoryItem,type:MovementType){this.movementItem.set(item);const first=this.activeWarehouseList()[0]?.id||1;this.movementForm={type,quantity:1,warehouseId:first,targetWarehouseId:this.activeWarehouseList().find(x=>x.id!==first)?.id||first,reference:'',actor:'محمد رضایی',notes:''};this.movementDialog.set(true);}
 closeMovement(){this.movementDialog.set(false);}
 saveMovement(){
  const item=this.movementItem();const f=this.movementForm;const qty=Number(f.quantity);if(!item||!Number.isInteger(qty)||qty<1){this.notify('مقدار باید یک عدد صحیح و بزرگ‌تر از صفر باشد.');return;}
  const source=this.stockAt(item,Number(f.warehouseId));if((f.type==='خروج'||f.type==='انتقال')&&qty>source){this.notify(`موجودی انبار مبدأ کافی نیست؛ موجودی فعلی ${source} ${item.unit} است.`);return;}
  if(f.type==='انتقال'&&(!f.targetWarehouseId||Number(f.targetWarehouseId)===Number(f.warehouseId))){this.notify('انبار مقصد را متفاوت از انبار مبدأ انتخاب کنید.');return;}
  this.items.update(list=>list.map(x=>{if(x.id!==item.id)return x;const stocks=x.stocks.map(s=>({...s}));const ensure=(id:number)=>{let row=stocks.find(s=>s.warehouseId===id);if(!row){row={warehouseId:id,quantity:0};stocks.push(row);}return row;};if(f.type==='ورود')ensure(Number(f.warehouseId)).quantity+=qty;else if(f.type==='خروج')ensure(Number(f.warehouseId)).quantity-=qty;else{ensure(Number(f.warehouseId)).quantity-=qty;ensure(Number(f.targetWarehouseId)).quantity+=qty;}return{...x,stocks};}));
  const id=this.nextMovement++;this.movements.update(list=>[{id,code:`ST-1405-${String(41+id).padStart(3,'0')}`,type:f.type,itemId:item.id,quantity:qty,date:'1405/08/28',warehouseId:Number(f.warehouseId),targetWarehouseId:f.type==='انتقال'?Number(f.targetWarehouseId):undefined,reference:f.reference,actor:f.actor||'ثبت‌نشده',notes:f.notes},...list]);this.movementDialog.set(false);this.notify(`عملیات ${f.type} موجودی با موفقیت ثبت شد.`);
 }
 exportCsv(){const rows=[['کد کالا','نام کالا','دسته‌بندی','واحد','موجودی کل','حداقل موجودی','بهای واحد','تأمین‌کننده'],...this.items().map(x=>[x.sku,x.name,x.category,x.unit,String(this.itemTotal(x)),String(x.minStock),String(x.unitCost),x.supplier])];const csv='\uFEFF'+rows.map(row=>row.map(v=>`"${v.replace(/"/g,'""')}"`).join(',')).join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='ashkan-inventory.csv';a.click();URL.revokeObjectURL(url);this.notify('خروجی CSV فهرست موجودی آماده شد.');}
 private notify(message:string){this.toast.set(message);if(this.toastTimer)clearTimeout(this.toastTimer);this.toastTimer=setTimeout(()=>this.toast.set(''),3200);}
}
