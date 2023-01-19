# vscode-bear-goto-sql

[vscode-bear-goto-sql - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=YukiAdachi.vscode-bear-goto-sql)

## Features

- Go to sql file


## e.g.

- `@Named("getFoo=getFOO,getBar=getBAR")` => jump to `var/db/sql/getBAR.sql`
- `@Query(id="getHoge"` => jump to `var/db/sql/getHoge.sql`
- `@Query("getPiyo", type="row")` => jump to `var/db/sql/getPiyo.sql`
- `#[DbQuery(id:'foo_bar_list')]` => jump to `var/db/sql/foo_bar_list.sql`
- `#[DbQuery('get_hoge_piyo')]` => jump to `var/db/sql/get_hoge_piyo.sql`
