---
title: Laravel の request にパラメーターをコントローラー内で追加する
date: 2018-03-13
author: kenzauros
tags: [Laravel, その他]
---



public function index(Request $request, $kind)
{
    $inventoryInfo = $this->countInventory($request, $kind);

    return $this->paginated($request, $inventoryInfo);
}

public function getWarehouseStocks(Request $request, $warehouseId, $kind)
{
    $request->request->add(['warehouse_id' => $warehouseId]);
    $request->request->add(['limit' => 10000]);
    return $this->index($request, $kind);
}