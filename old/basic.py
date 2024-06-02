# import pygame
# import random

# # Initialize Pygame
# pygame.init()

# # Screen dimensions
# width, height = 300, 600
# screen = pygame.display.set_mode((width, height))
# clock = pygame.time.Clock()

# # Game variables
# grid = [[0 for _ in range(10)] for _ in range(20)]
# shapes = [
#     [[1, 1, 1], [0, 1, 0]],  # T shape
#     [[1, 1, 1, 1]],  # I shape
#     [[1, 1], [1, 1]],  # O shape
#     # Add more shapes
# ]
# current_shape = random.choice(shapes)

# def draw_grid():
#     for y in range(20):
#         for x in range(10):
#             color = (255, 255, 255) if grid[y][x] else (0, 0, 0)
#             pygame.draw.rect(screen, color, pygame.Rect(x*30, y*30, 30, 30))

# def draw_shape():
#     for y, row in enumerate(current_shape):
#         for x, cell in enumerate(row):
#             if cell:
#                 pygame.draw.rect(screen, (255, 0, 0), pygame.Rect(x*30, y*30, 30, 30))

# # Main loop
# running = True
# while running:
#     screen.fill((0, 0, 0))
#     draw_grid()
#     draw_shape()
#     pygame.display.flip()
#     clock.tick(60)
    
#     for event in pygame.event.get():
#         if event.type == pygame.QUIT:
#             running = False

# pygame.quit()
