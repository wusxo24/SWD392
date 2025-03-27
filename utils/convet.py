import pandas as pd
import json

# File paths
boy_file_path = "boy_weight_for_length.csv"
girl_file_path = "girl_weight_for_length.csv"

# Output file paths for JSON
boy_json_output_path = "boy_weight_for_length.json"
girl_json_output_path = "girl_weight_for_length.json"

try:
    # Load CSV files into DataFrames
    boy_df = pd.read_csv(boy_file_path)
    girl_df = pd.read_csv(girl_file_path)

    # Convert DataFrames to JSON format
    boy_json = boy_df.to_json(orient="records", indent=4)
    girl_json = girl_df.to_json(orient="records", indent=4)

    # Write JSON data to files
    with open(boy_json_output_path, 'w') as f:
        f.write(boy_json)
    print(f"Successfully converted '{boy_file_path}' to '{boy_json_output_path}'")

    with open(girl_json_output_path, 'w') as f:
        f.write(girl_json)
    print(f"Successfully converted '{girl_file_path}' to '{girl_json_output_path}'")
except FileNotFoundError as e:
    print(f"Error: One or both of the input CSV files were not found. Please check the file paths.\n{e}")
except Exception as e:
    print(f"An error occurred during the conversion process:\n{e}")