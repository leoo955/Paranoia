import re

with open("src/app/cards/PackOpenerClient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Extract the title/stock block
# We know it starts with `{/* Title & Stock info moved ABOVE ACTION BUTTONS */}`
# and ends right before `{/* Center: Action Buttons */}`

match = re.search(r'(\s*\{\/\* Title & Stock info moved ABOVE ACTION BUTTONS \*\/.*?</div>\s*)(?=\{\/\* Center: Action Buttons \*\/\})', content, flags=re.DOTALL)
if match:
    block = match.group(1)
    
    # 2. Remove it from its current location
    content = content.replace(block, '\n                ')
    
    # 3. Insert it right before {/* Carousel Container */}
    new_block = block.replace("ABOVE ACTION BUTTONS", "TO TOP").replace("mb-6 text-center", "mb-2 text-center")
    
    carousel_marker = "{/* Carousel Container */}"
    content = content.replace(carousel_marker, new_block + "\n              " + carousel_marker)

    with open("src/app/cards/PackOpenerClient.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Moved Title & Stock to top!")
else:
    print("Could not find the block to move.")
