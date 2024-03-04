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

  p, manager, employees, (list)|(show)
  p, manager, equipment, (list)|(show)|(create)|(delete)|(edit)
  p, manager, customers, (list)|(show)|(create)|(delete)|(edit)
  p, manager, orders, (list)|(show)|(create)|(delete)|(edit)
  p, manager, products, (list)|(show)|(create)|(delete)|(edit)
  p, manager, sawmills, (list)|(show)
  p, executive, materials, (list)|(show)|(create)|(delete)|(edit)
  p, executive, wastes, (list)|(show)|(create)|(delete)|(edit)

  p, worker, employees, (list)|(show)
  p, worker, equipment, (list)|(show)
  p, worker, customers, (list)|(show)
  p, worker, orders, (list)|(show)
  p, worker, products, (list)|(show)
  p, worker, sawmills, (list)|(show)
  p, executive, materials, (list)|(show)
  p, executive, wastes, (list)|(show)
`);