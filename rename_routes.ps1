$replacements = @(
    @{ Old = "'/products-category'"; New = "'/product-category'" },
    @{ Old = "'/products'"; New = "'/product'" },
    @{ Old = "'/roles'"; New = "'/role'" },
    @{ Old = "'/accounts'"; New = "'/account'" },

    @{ Old = "`${prefixAdmin}/products-category"; New = "`${prefixAdmin}/product-category" },
    @{ Old = "`${prefixAdmin}/products"; New = "`${prefixAdmin}/product" },
    @{ Old = "`${prefixAdmin}/roles"; New = "`${prefixAdmin}/role" },
    @{ Old = "`${prefixAdmin}/accounts"; New = "`${prefixAdmin}/account" },

    @{ Old = "href=""/products"""; New = "href=""/product""" },
    @{ Old = "href=""/products/"; New = "href=""/product/" },
    @{ Old = "action=""/products"; New = "action=""/product" }
)

$directories = @("controllers", "routes", "views")

foreach ($dir in $directories) {
    $files = Get-ChildItem -Path $dir -Recurse -Include *.js, *.pug
    foreach ($file in $files) {
        $content = Get-Content -Path $file.FullName -Raw
        $originalContent = $content
        
        foreach ($replacement in $replacements) {
            # Escape strings if needed, but since they contain special characters like ` or / or ', we use [regex]::Escape but here we want exact string replacement.
            # In PowerShell string.Replace is exact match and fast.
            $content = $content.Replace($replacement.Old, $replacement.New)
        }
        
        if ($content -cne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "Updated $($file.FullName)"
        }
    }
}
