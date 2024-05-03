import { newModel, StringAdapter } from "casbin";

export const model = newModel(`
  [request_definition]
  r = sub, obj, act

  [policy_definition]
  p = sub, obj, act

  [role_definition]
  g = _, _

  [policy_effect]
  e = some(where (p.eft == allow))

  [matchers]
  m = g(r.sub, p.sub) && keyMatch(r.obj, p.obj) && regexMatch(r.act, p.act)
`);

export const adapter = new StringAdapter(`
  p, executive, employees, (list)|(show)|(create)|(delete)|(edit)
  p, executive, equipment, (list)|(show)|(create)|(delete)|(edit)
  p, executive, customers, (list)|(show)|(create)|(delete)|(edit)
  p, executive, orders, (list)|(show)|(create)|(delete)|(edit)
  p, executive, products, (list)|(show)|(create)|(delete)|(edit)
  p, executive, sawmills, (list)|(show)|(create)|(delete)|(edit)
  p, executive, materials, (list)|(show)|(create)|(delete)|(edit)
  p, executive, wastes, (list)|(show)|(create)|(delete)|(edit)
  p, executive, inventory, (list)|(show)|(create)|(delete)|(edit)
  p, executive, manage-materials, (list)|(show)|(create)|(delete)|(edit)
  p, executive, manage-wastes, (list)|(show)|(create)|(delete)|(edit)
  p, executive, manage-products, (list)|(show)|(create)|(delete)|(edit)
  p, executive, dailylogs, (list)|(show)|(create)|(delete)|(edit)
  p, executive, dashboard, (list)|(show)|(create)|(delete)|(edit)

  p, manager, employees, (list)|(show)
  p, manager, equipment, (list)|(show)|(create)|(delete)|(edit)
  p, manager, customers, (list)|(show)|(create)|(delete)|(edit)
  p, manager, orders, (list)|(show)|(create)|(delete)|(edit)
  p, manager, products, (list)|(show)|(create)|(delete)|(edit)
  p, manager, sawmills, (list)|(show)|(edit)
  p, manager, materials, (list)|(show)|(create)|(delete)|(edit)
  p, manager, wastes, (list)|(show)|(create)|(delete)|(edit)
  p, manager, inventory, (list)|(show)|(create)|(delete)|(edit)
  p, manager, manage-materials, (list)|(show)|(create)|(delete)|(edit)
  p, manager, manage-wastes, (list)|(show)|(create)|(delete)|(edit)
  p, manager, manage-products, (list)|(show)|(create)|(delete)|(edit)
  p, manager, dailylogs, (list)|(show)|(create)|(delete)|(edit)
  p, manager, dashboard, (list)|(show)|(create)|(delete)|(edit)

  p, worker, employees, (list)|(show)
  p, worker, equipment, (list)|(show)
  p, worker, customers, (list)|(show)
  p, worker, orders, (list)|(show)
  p, worker, products, (list)|(show)
  p, worker, sawmills, (list)|(show)
  p, worker, materials, (list)|(show)
  p, worker, wastes, (list)|(show)
  p, worker, inventory, (list)|(show)
  p, worker, manage-materials, (list)|(show)
  p, worker, manage-wastes, (list)|(show)
  p, worker, manage-products, (list)|(show)
  p, worker, dailylogs, (list)|(show)
  p, worker, dashboard, (list)|(show)

`);
